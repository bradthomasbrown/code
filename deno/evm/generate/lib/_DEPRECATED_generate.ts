import { emptyDir } from 'https://deno.land/std@0.224.0/fs/empty_dir.ts'

import { SolcJsonOutputObject } from "solc/types/_SolcJsonOutputObject.ts";
import { LinkReferences } from "solc/types/_LinkReferences.ts";
import { FunctionDescriptor } from "solc/types/_FunctionDescriptor.ts";
import { ConstructorDescriptor } from "solc/types/_ConstructorDescriptor.ts";
import { ReceiveDescriptor } from "solc/types/_ReceiveDescriptor.ts";
import { FallbackDescriptor } from "solc/types/_FallbackDescriptor.ts";
import { EventDescriptor } from "solc/types/_EventDescriptor.ts";
import { ErrorDescriptor } from "solc/types/_ErrorDescriptor.ts";
import { SolcJsonOutputSource as SourceX } from "solc/types/_SolcJsonOutputSource.ts";
import { SolcJsonOutputContract as ContractX } from "solc/types/_SolcJsonOutputContract.ts";
import { Descriptor } from 'solc/types/_Descriptor.ts';

type FunctionDescriptors = Map<string, FunctionDescriptor[]>

type EventDescriptors = Map<string, EventDescriptor[]>

type ErrorDescriptors = Map<string, ErrorDescriptor[]>

type ContractYDescriptors = {
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
    descriptors: ContractYDescriptors
}

type SourceY = Map<string, ContractY>

export async function generate(output:SolcJsonOutputObject, root?:string) {

    if (!output.contracts) return
    
    root ??= '.'

    const mapMapValue = <K, X, Y>(map: Map<K, X>, mapper: (x: X) => Y): Map<K, Y> =>
        new Map([...map.entries()].map(([k, x]) => [k, mapper(x)]))

    function mapType(type:string) {
        if (true) return 'unknown'
        throw new Error('unhandled mapType', { cause: type })
    }

    function updateDescriptors(descriptors: ContractYDescriptors, descriptor: Descriptor) {
        const { functions, events, errors } = descriptors
        if (!descriptor.type || descriptor.type == 'function') functions.set(descriptor.name, [...functions.get(descriptor.name) ?? [], descriptor])
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
        const descriptors: ContractYDescriptors = { functions, events, errors }
        for (const descriptor of contractX?.abi ?? []) updateDescriptors(descriptors, descriptor)
        return { bytecode, linkReferences, descriptors }
    }

    const mapSource = (sourceX: SourceX): SourceY => mapMapValue(sourceX, mapContract)

    async function buildReceive(_descriptor: ReceiveDescriptor, root: string) {
        await Deno.mkdir(`${root}/receive`)
    }

    async function buildFallback(_descriptor: FallbackDescriptor, root: string) {
        await Deno.mkdir(`${root}/fallback`)
    }

    async function buildConstructor(_descriptor: ConstructorDescriptor, root: string) {
        await Deno.mkdir(`${root}/construct`)
    }

    async function buildError(name: string, _descriptors: ErrorDescriptor[], root: string) {
        const dir = `${root}/${name}`
        await Deno.mkdir(dir)
    }

    async function buildEvent(name: string, _descriptors: EventDescriptor[], root: string) {
        const dir = `${root}/${name}`
        await Deno.mkdir(dir)
    }

    async function buildFunction(name: string, descriptors: FunctionDescriptor[], root: string) {
    
        const dir = `${root}/${name}`
        await Deno.mkdir(dir)

        await Deno.writeTextFile(`${dir}/inputs.ts`, 'export function inputs() {}')

        await Deno.writeTextFile(`${dir}/selector.ts`, `export function selector(parameters:unknown) {}`)

        async function buildEncoder() {

            const imports = 
                `${`import { defaultAbiEncode } from '../../../../../../../lib/_defaultAbiEncode.ts'\n`
                }${`import { inputs } from './inputs.ts'\n`
                }${`import { selector } from './selector.ts'`}`

            const types = ''

            let overloadSignatures = ''
            if (descriptors.length == 1) {
                const [descriptor] = descriptors
                if (!descriptor.inputs.length) {
                    // NOOP
                } else if (descriptor.inputs.every(({ name }) => name)) {
                    const mapTypedParameters = descriptor.inputs.map(input => `${input.name}:${mapType(input.type)}`)
                    const parameterNames = descriptor.inputs.map(({ name }) => name).join()
                    overloadSignatures +=
                        `${`export function encode(${mapTypedParameters}): string\n`
                        }${`export function encode({${parameterNames}}:{${mapTypedParameters}}): string`}`
                } else {
                    // NOOP
                }
            } else {
                // TODO
            }

            let implementationSignature = ''
            if (descriptors.length == 1) {
                const [descriptor] = descriptors
                if (!descriptor.inputs.length) {
                    implementationSignature =
                        `export function encode(...parameters: []): string`
                } else if (descriptor.inputs.every(({ name }) => name)) {
                    const mapTypedParameters = descriptor.inputs.map(input => `${input.name}:${mapType(input.type)}`)
                    implementationSignature =
                        `export function encode(...parameters: [${mapTypedParameters}]|[{${mapTypedParameters}}]): string`
                } else {
                    const mappedTypes = descriptor.inputs.map(({ type }) => type).map(mapType).join()
                    implementationSignature +=
                        `export function encode(...parameters: [${mappedTypes}]): string`
                }
            } else {
                implementationSignature +=
                    `export function encode(...parameters:unknown[]): string`
            }

            const signatures = 
                `${overloadSignatures ? `${overloadSignatures}\n` : ''
                }${implementationSignature}`

            const implementation = '{ return `0x${selector(parameters)}${defaultAbiEncode(parameters, inputs)}` }'

            const content =
                `${`${imports}\n\n`
                }${types ? `${types}\n\n` : ''
                }${`${signatures} `
                }${implementation}`

            await Deno.writeTextFile(`${dir}/encode.ts`, content)

        }

        await buildEncoder()

    }

    async function buildContract(name: string, contract: ContractY, root: string) {
        const { bytecode, descriptors: { functions, events, errors, construct, fallback, receive } } = contract
        const dir = `${root}/${name.replace(/^I?/, 'I')}`
        await Deno.mkdir(dir)
        if (bytecode) await Deno.writeTextFile(`${dir}/bytecode.ts`, `export const bytecode = '${bytecode}'`)
        for (const entry of [...functions.entries()]) await buildFunction(...entry, dir)
        for (const entry of [...events.entries()]) await buildEvent(...entry, dir)
        for (const entry of [...errors.entries()]) await buildError(...entry, dir)
        if (construct) await buildConstructor(construct, dir)
        if (fallback) await buildFallback(fallback, dir)
        if (receive) await buildReceive(receive, dir)
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