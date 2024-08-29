import { ensureDir } from 'https://deno.land/std@0.224.0/fs/ensure_dir.ts'
import { ExtendedMap } from '../../../../stdplus/map/lib/ExtendedMap.ts'
import { Templar } from '../../../../stdplus/templar/lib/mod.ts'
import {
    Source,
    Sources,
    Contract,
    Contracts,
    LinkReferences,
    Descriptors,
    Descriptor,
    Offsets,
    Fn
} from '../../../solc/output/types/mod.ts'
import { common } from 'https://deno.land/std@0.224.0/path/common.ts';
import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { keccak } from "../../../lib/keccak.ts";
import { link } from "../templates/_link.ts";
import { descriptor } from "../../../solc/output/schemas/mod.ts";

const kv = await Deno.openKv(':memory:')

type Ref = { library: string, placeholder: string }
type Refs = Ref[]

const templar = new Templar(import.meta.resolve('../templates'))

export async function generate(rootDir: string, sources: Sources): Promise<void> {
    const cwd = Deno.cwd()
    const cmn = common([rootDir, cwd])
    if (cmn == rootDir && rootDir != cwd)
        throw new Error(`sanity check failed: baseDir should not be parent of cwd`)
    
    await Deno.remove(rootDir, { recursive: true }).catch(() => {})
    await ensureDir(rootDir)
    
    const rootKey = ['root']
    const dir = rootDir
    const value = { dir, sources }
    await kv.set(rootKey, value)
    await createRoot(rootKey)
}

async function createRoot(rootKey: Deno.KvKey): Promise<void> {
    const { value } = await kv.get<{ dir: string, sources: Sources }>(rootKey)
    assert(value, `key not found: ${rootKey}`)
    const { dir: rootDir, sources } = value
    await ensureDir(rootDir)
    for (const [sourceName, source] of sources)
    {
        const sourceKey = [...rootKey, sourceName]
        const dir = `${rootDir}/${sourceName}`
        const contracts = source
        const value = { dir, contracts }
        await kv.set(sourceKey, value)
        await createSource(sourceKey)
    }
}

async function createSource(sourceKey: Deno.KvKey): Promise<void> {
    const { value } = await kv.get<{ dir: string, contracts: Contracts }>(sourceKey)
    assert(value, `key not found: ${sourceKey}`)
    const { dir: sourceDir, contracts } = value
    await ensureDir(sourceDir)
    for (const [contractName, contract] of contracts)
    {
        const contractKey = [...sourceKey, contractName]
        const dir = `${sourceDir}/${contractName}`
        const value = { dir, contract }
        await kv.set(contractKey, value)
        await createContract(contractKey)
    }
}

async function createContract(contractKey: Deno.KvKey): Promise<void> {
    const { value } = await kv.get<{ dir: string, contract: Contract}>(contractKey)
    assert(value, `key not found: ${contractKey}`)
    const { dir: contractDir, contract } = value
    await ensureDir(contractDir)

    const { object: bytecode, linkReferences } = contract?.evm?.bytecode ?? {}

    if (bytecode)
    {
        const bytecodeKey = [...contractKey, 'bytecode']
        const value = { bytecode, linkReferences }
        await kv.set(bytecodeKey, value)
        await handleBytecode(bytecodeKey)
    }

    const { abi } = contract
    if (abi)
    {
        const abiKey = [...contractKey, 'abi']
        const value = { abi }
        await kv.set(abiKey, value)
        await handleDescriptors(abiKey)
    }
}

async function handleBytecode(bytecodeKey: Deno.KvKey): Promise<void> {

    const sourcekey = bytecodeKey.slice(0, -2)
    const { dir: sourceDir } = await assertGet<{
        dir: string;
        contracts: Contracts;
    }>(sourcekey, `key not found: ${sourcekey}`)

    const contractKey = bytecodeKey.slice(0, -1)
    const { dir: contractDir } = await assertGet<{
        dir: string;
        contract: Contract;
    }>(contractKey, `key not found: ${contractKey}`)

    const { bytecode, linkReferences: linkReferencesMap } = await assertGet<{
        bytecode: string;
        linkReferences?: LinkReferences;
    }>(bytecodeKey, `key not found: ${bytecodeKey}`)
    const linkReferences = linkReferencesMap
        ? [...linkReferencesMap.entries()]
            .reduce((sources, [sourceName, libraries]) =>
                sources.set(sourceName, new ExtendedMap(libraries)),
            new ExtendedMap<string, ExtendedMap<string, Offsets>>())
        : undefined
    
    if (linkReferences)
    {
        const refs = linkReferencesToRefs(linkReferences)
        const cstrs = refs.map(_ => 'string').join(', ')
        const clibs = refs.map(r => r.library).join(', ')
        const clibstrs = refs.map(r => `${r.library}: string`).join(', ')

        // write link file
        await templar.generate(
            '_link.ts',
            [],
            `${sourceDir}/_link.ts`
        )

        // write refs file
        await templar.generate(
            '_refs.ts',
            [{ type: 'expression', id: 'refs', content: JSON.stringify(refs) }],
            `${contractDir}/_refs.ts`
        )

        // write bytecode string file
        await templar.generate(
            '_bytecodeString.ts',
            [{ type: 'expression', id: 'bytecode', content: JSON.stringify(bytecode) }],
            `${contractDir}/_bytecodeString.ts`
        )

        // write bytecode function file
        await templar.generate(
            'bytecode.ts',
            [
                { type: 'expression', id: 'link', content: `await import('../_link.ts')` },
                { type: 'expression', id: 'bytecodeString', content: `await import('./_bytecodeString.ts')` },
                { type: 'expression', id: 'refs', content: `await import('./_refs.ts')` },
                { type: 'type', id: 'ByIndex', content: `[${cstrs}]` },
                { type: 'type', id: 'ByName', content: `{ ${clibstrs} }` },
                { type: 'parameter', id: 'paramsByIndex', content: clibstrs },
                { type: 'parameter', id: 'paramsByName', content: `{ ${clibs} }:{ ${clibstrs} }` },
            ],
            `${contractDir}/bytecode.ts`
        )
    }
    else
    {
        // write bytecode string file
        await templar.generate(
            '_bytecodeString.ts',
            [{ type: 'expression', id: 'bytecode', content: JSON.stringify(bytecode) }],
            `${contractDir}/bytecode.ts`
        )
    }
}

function linkReferencesToRefs(linkReferences: ExtendedMap<string, ExtendedMap<string, Offsets>>): Refs {
    return linkReferences
        .foldlWithKey((sourceName, libraries, refs) => libraries
        .foldlWithKey((libraryName, _offsets, refs) =>
    {
        const library = libraryName
        const placeholder = `__$${keccak(`${sourceName}:${libraryName}`).slice(0, 34)}$__`
        refs.push({ library, placeholder })
        return refs
    }, refs), <Refs>[])
}

async function handleDescriptors(abiKey: Deno.KvKey): Promise<void> {

    const contractKey = abiKey.slice(0, -1)
    const { dir: contractDir } = await assertGet<{
        dir: string;
        contract: Contract;
    }>(contractKey, `key not found: ${contractKey}`) 

    const { abi } = await assertGet<{
        abi: Descriptors
    }>(abiKey, `key not found: ${abiKey}`)

    for (const [descriptorSetName, descriptorSet] of abi)
    {
        const descriptorSetKey = [...abiKey, descriptorSetName]
        const dir = `${contractDir}/${descriptorSetName}`
        const value = { dir, descriptorSet }
        await kv.set(descriptorSetKey, value)
        await handleDescriptorSet(descriptorSetKey)
    }

}

async function handleDescriptorSet(descriptorSetKey: Deno.KvKey): Promise<void> {

    const { dir: descriptorSetDir, descriptorSet } = await assertGet<{
        dir: string
        descriptorSet: Descriptor[]
    }>(descriptorSetKey, `key not found: ${descriptorSetKey}`)
    
    await ensureDir(descriptorSetDir)

    const setType = descriptorSet[0].type ?? 'function'
    assert(descriptorSet.every(({ type }) => (type ?? 'function') == setType), 'descriptor set contains mixed types')

    if (setIsFn(descriptorSet))
    {
        if (descriptorSet.length > 1)
        {

        }
        else
        {

            const [descriptor] = descriptorSet
            const ctypes = descriptor.inputs.map(({ type }) => type).join(',')
            const signature = `${descriptor.name}(${ctypes})`
            const selector = keccak(signature).slice(0, 8)

            await templar.generate(
                'selector.ts',
                [{ type: 'expression', id: 'selector', content: JSON.stringify(selector) }],
                `${descriptorSetDir}/selector.ts`
            )

        }
    }

}

function setIsFn(descriptors: Descriptor[]): descriptors is Fn[] {
    const [descriptor] = descriptors
    return (descriptor.type ?? 'function') == 'function'
}

async function assertGet<T>(key: Deno.KvKey, message: string): Promise<T> {
    const { value } = await kv.get<T>(key)
    assert(value, message)
    return value
}