import { emptyDir } from 'https://deno.land/std@0.224.0/fs/empty_dir.ts'
import { SolcJsonOutputObject } from "../../solc/types/_SolcJsonOutputObject.ts";
import { LinkReferences } from "../../solc/types/_LinkReferences.ts";
import { FunctionDescriptor } from "../../solc/types/_FunctionDescriptor.ts";
import { ConstructorDescriptor } from "../../solc/types/_ConstructorDescriptor.ts";
import { ReceiveDescriptor } from "../../solc/types/_ReceiveDescriptor.ts";
import { FallbackDescriptor } from "../../solc/types/_FallbackDescriptor.ts";
import { EventDescriptor } from "../../solc/types/_EventDescriptor.ts";
import { ErrorDescriptor } from "../../solc/types/_ErrorDescriptor.ts";
import { SolcJsonOutputSource as SourceX } from "../../solc/types/_SolcJsonOutputSource.ts";
import jsSha3 from 'npm:js-sha3@0.9.2'
import { SolcJsonOutputContract as ContractX } from "../../solc/types/_SolcJsonOutputContract.ts";
import { resolve } from 'https://deno.land/std@0.224.0/path/resolve.ts';
const { keccak256 } = jsSha3

function getSelector(s:string) { return `0x${keccak256(s).slice(0, 8)}` }

type FunctionDescriptors = Map<string, FunctionDescriptor[]>

type EventDescriptors = Map<string, EventDescriptor[]>

type ErrorDescriptors = Map<string, ErrorDescriptor[]>

type ContractDescriptor = FunctionDescriptor
    | EventDescriptor
    | ErrorDescriptor
    | ConstructorDescriptor
    | ReceiveDescriptor
    | FallbackDescriptor

type ContractDescriptors = {
    functions: FunctionDescriptors,
    events: EventDescriptors
    errors: ErrorDescriptors
    construct?: ConstructorDescriptor
    receive?: ReceiveDescriptor
    fallback?: FallbackDescriptor
}

type ContractY = {
    bytecode?: string
    linkReferences?: LinkReferences
    descriptors: ContractDescriptors
}

type SourceY = Map<string, ContractY>

export async function generate(output:SolcJsonOutputObject, root?:string) {

    if (!output.contracts) return
    
    root ??= '.'

    const mapMapValue = <K, X, Y>(map: Map<K, X>, mapper: (x: X) => Y): Map<K, Y> =>
        new Map([...map.entries()].map(([k, x]) => [k, mapper(x)]))

    function updateDescriptors(descriptors: ContractDescriptors, descriptor: ContractDescriptor) {
        const { functions, events, errors } = descriptors
        if (descriptor.type == 'function') functions.set(descriptor.name, [...functions.get(descriptor.name) ?? [], descriptor])
        else if (descriptor.type == 'event') events.set(descriptor.name, [...events.get(descriptor.name) ?? [], descriptor])
        else if (descriptor.type == 'error') errors.set(descriptor.name, [...errors.get(descriptor.name) ?? [], descriptor])
        else if (descriptor.type == 'constructor') descriptors.construct = descriptor
        else if (descriptor.type == 'receive') descriptors.receive = descriptor
        else if (descriptor.type == 'fallback') descriptors.fallback = descriptor
    }

    function mapContract(contractX: ContractX): ContractY {
        const bytecode = contractX.evm?.bytecode?.object
        const linkReferences = contractX.evm?.bytecode?.linkReferences
        const functions = new Map(), events = new Map(), errors = new Map()
        const descriptors: ContractDescriptors = { functions, events, errors }
        for (const descriptor of contractX?.abi ?? []) updateDescriptors(descriptors, descriptor)
        return { bytecode, linkReferences, descriptors }
    }

    const mapSource = (sourceX: SourceX): SourceY => mapMapValue(sourceX, mapContract)

    async function buildInputlessFunctionEncoder(name: string, root: string) {
        const selector = getSelector(`${name}()`)
        await Deno.writeTextFile(`${root}/encode.ts`, `export function encode():'${selector}' { return '${selector}' }`)
        // TODO: writing to any mod.ts probably shouldn't happen here
        await Deno.writeTextFile(`${root}/mod.ts`, `export { encode } from './encode.ts'`)
        await Deno.writeTextFile(resolve(root, '../mod.ts'), `export * as ${name} from './${name}/mod.ts'\n`, { append: true })
    }

    async function buildFunction(name: string, descriptors: FunctionDescriptor[], root: string) {
        const dir = `${root}/${name}`
        await Deno.mkdir(dir, { recursive: true })
        if (descriptors.every(({ inputs }) => !inputs.length)) await buildInputlessFunctionEncoder(name, dir)
    }

    async function buildContract(name: string, contract: ContractY, root: string) {
        const { bytecode, descriptors: { functions } } = contract
        const dir = `${root}/${name.replace(/^I?/, 'I')}`
        await Deno.mkdir(dir)
        if (bytecode) await Deno.writeTextFile(`${dir}/bytecode.ts`, `export const bytecode = '${bytecode}'`)
        // await Deno.writeTextFile(`${contractDir}/mod.ts`, `export * from './bytecode.ts'`, { append: true })
        for (const entry of [...functions.entries()]) buildFunction(...entry, dir)
    }

    async function buildSource(name: string, source: SourceY) {
        const dir = `${root}/${name.replace(/^I?/, 'I')}`
        await Deno.mkdir(dir)
        for (const entry of [...source.entries()]) await buildContract(...entry, dir)
    }

    const sources = mapMapValue(output.contracts, mapSource)

    await emptyDir(root)

    for (const entry of [...sources.entries()]) await buildSource(...entry)

}