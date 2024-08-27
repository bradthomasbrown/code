import { ensureDir } from 'https://deno.land/std@0.224.0/fs/ensure_dir.ts'
import { ExtendedMap } from '../../../../stdplus/map/lib/ExtendedMap.ts'
import { Templar } from '../../../../stdplus/templar/lib/mod.ts'
import {
    Source,
    Sources,
    Contract,
    LinkReferences,
    Descriptors
} from '../../../solc/output/types/mod.ts'
import { common } from 'https://deno.land/std@0.224.0/path/common.ts';
import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { keccak } from "../../../lib/keccak.ts";

type Context = Map<string, string>

type Ref = { library: string, placeholder: string }
type Refs = Ref[]

const templar = new Templar(import.meta.resolve('../templates'))

export async function generate(root: string, sources: Sources): Promise<void> {
    const cwd = Deno.cwd()
    const cmn = common([root, cwd])
    if (cmn == root && root != cwd)
        throw new Error(`sanity check failed: baseDir should not be parent of cwd`)
    
    await Deno.remove(root, { recursive: true }).catch(() => {})
    await ensureDir(root)

    const context = new Map([['root', root]])
    const dir = root
    for (const [sourceName, source] of sources)
        await createSource(context.set('source', `${dir}/${sourceName}`), source)
}

async function createSource(context: Context, source: Source): Promise<void> {
    const path = context.get('source')
    assert(path, 'source path not set')
    await ensureDir(path)
    const contracts = source
    for (const [contractName, contract] of contracts)
        await createContract(context.set('contract', `${path}/${contractName}`), contract)
}

async function createContract(context: Context, contract: Contract): Promise<void> {
    const path = context.get('contract')
    assert(path, 'contract path not set')
    await ensureDir(path)

    const bytecode = contract?.evm?.bytecode?.object
    if (bytecode) {
        const linkReferences = contract?.evm?.bytecode?.linkReferences
        const refs: Refs = []
        if (linkReferences) {
            for (const [sourceName, source] of linkReferences) {
                const libaries = source
                for (const [library, _offsets] of libaries) {
                    const placeholder = `__$${keccak(`${sourceName}:${library}`).slice(0, 34)}$__`
                    refs.push({ library, placeholder })
                }
            }
            await writeLink(context)
            await writeRefs(context, refs)
        }
        await writeBytecodeString(context, bytecode)
        await writeBytecodeFunction(context, refs)
    }

    // const abi: Descriptors = contract.abi ?? new Map()
    // for (const [descriptorName, descriptor] of abi) await handleDescriptor(contractPath, descriptorName, descriptor)
}

async function writeLink(context: Context): Promise<void> {
    const path = context.get('source')
    assert(path, 'source path not set')
    assert(await exists(path), 'source dir not found')
    await templar.generate('_link.ts', [], `${path}/_link.ts`)
}

async function writeRefs(context: Context, refs: Refs): Promise<void> {
    const path = context.get('contract')
    assert(path, 'contract path not set')
    assert(await exists(path), 'contract dir not found')
    await templar.generate(
        '_refs.ts',
        [{ type: 'expression', id: 'refs', content: JSON.stringify(refs) }],
        `${path}/_refs.ts`
    )
}

async function writeBytecodeString(context: Context, bytecode: string): Promise<void> {
    const path = context.get('contract')
    assert(path, 'contract path not set')
    assert(await exists(path), 'contract dir not found')
    await templar.generate(
        '_bytecodeString.ts',
        [{ type: 'expression', id: 'bytecode', content: JSON.stringify(bytecode) }],
        `${path}/_bytecodeString.ts`
    )
}

async function writeBytecodeFunction(context: Context, refs: Refs): Promise<void> {
    const path = context.get('contract')
    assert(path, 'contract path not set')
    assert(await exists(path), 'contract dir not found')
    const cstrs = refs.map(_ => 'string').join(', ')
    const clibs = refs.map(r => r.library).join(', ')
    const clibstrs = refs.map(r => `${r.library}: string`).join(', ')
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
        `${path}/bytecode.ts`
    )
    // const { bytecode: bytecodeString } = <typeof import('../templates/_bytecodeString.ts')>await import(`${path}/_bytecodeString.ts`)
    // const { link } = <typeof import('../templates/_link.ts')>await import(`${path}/bytecode.ts`)
    // const randaddrs = refs.map(_ => [...crypto.getRandomValues(new Uint8Array(20))].map(b => `0x${b.toString(16).padStart(2, '0')}`).join(''))
    // const byIndex = link(bytecodeString, refs, randaddrs)
    // const byName = link(bytecodeString, refs, [refs.reduce<Record<string, string>>((p, c, i) => ({ ...p, [c.library]: randaddrs[i] }), {})])
    // assert(byIndex == byName, 'link should be same by index and by name')
    // assert(byIndex.match(randaddrs[0]) && byName.match(randaddrs[1]), 'linked bytecode should contain addresses')
    // assert(!byIndex.match(/_/), 'linked bytecode should not contain placeholders')
}