import { SolcJsonOutputObject } from "../../solc/types/_SolcJsonOutputObject.ts";
import { LinkReferences } from "../../solc/types/_LinkReferences.ts";
import { FunctionDescriptor } from "../../solc/types/_FunctionDescriptor.ts";
import { ConstructorDescriptor } from "../../solc/types/_ConstructorDescriptor.ts";
import { ReceiveDescriptor } from "../../solc/types/_ReceiveDescriptor.ts";
import { FallbackDescriptor } from "../../solc/types/_FallbackDescriptor.ts";
import { EventDescriptor } from "../../solc/types/_EventDescriptor.ts";
import { ErrorDescriptor } from "../../solc/types/_ErrorDescriptor.ts";
import jsSha3 from 'npm:js-sha3@0.9.2'
const { keccak256 } = jsSha3

function selector(s:string) { return `0x${keccak256(s).slice(0, 8)}` }

type FunctionDescriptors = Map<string, FunctionDescriptor[]>

type EventDescriptors = Map<string, EventDescriptor[]>

type ErrorDescriptors = Map<string, ErrorDescriptor[]>

type ContractDescriptors = {
    functions: FunctionDescriptors,
    events: EventDescriptors
    errors: ErrorDescriptors
    construct?: ConstructorDescriptor
    receive?: ReceiveDescriptor
    fallback?: FallbackDescriptor
}

type Contract = {
    bytecode?: string
    linkReferences?: LinkReferences
    descriptors: ContractDescriptors
}

type Source = Map<string, Contract>

export async function generate(solcJsonOutput:SolcJsonOutputObject, buildDir?:string) {

    if (!solcJsonOutput.contracts) return
    
    buildDir ??= '.'
    const sources = new Map<string, Source>()

    function translateSolcJsonSourceToSources(solcJsonSourceName: string, solcJsonSource: unknown) {
        sources.set(solcJsonSourceName, new Map())
        for (const [contractName, solcJsonOutputContract] of [...solcJsonSource.entries()]) {
            const bytecode = solcJsonOutputContract.evm?.bytecode?.object
            const linkReferences = solcJsonOutputContract.evm?.bytecode?.linkReferences
            const functions = new Map(), events = new Map(), errors = new Map()
            const descriptors: ContractDescriptors = { functions, events, errors }
            const contract: Contract = { bytecode, linkReferences, descriptors }
            const contracts = sources.get(solcJsonSourceName)!
            contracts.set(contractName, contract)
            for (const descriptor of solcJsonOutputContract?.abi ?? []) {
                if (descriptor.type == 'function') functions.set(descriptor.name, [...functions.get(descriptor.name) ?? [], descriptor])
                else if (descriptor.type == 'event') events.set(descriptor.name, [...events.get(descriptor.name) ?? [], descriptor])
                else if (descriptor.type == 'error') errors.set(descriptor.name, [...errors.get(descriptor.name) ?? [], descriptor])
                else if (descriptor.type == 'constructor') descriptors.construct = descriptor
                else if (descriptor.type == 'receive') descriptors.receive = descriptor
                else if (descriptor.type == 'fallback') descriptors.fallback = descriptor
            }
        }
    }

    for (const entry of [...solcJsonOutput.contracts.entries()]) translateSolcJsonSourceToSources(...entry)

    
    if (await Deno.stat(buildDir).catch(()=>0)) await Deno.remove(buildDir, { recursive: true })
        await Deno.mkdir(buildDir, { recursive: true })
    for (const [sourceName, source] of [...sources.entries()]) {
        const sourceDir = `${buildDir}/${sourceName.replace(/^I?/, 'I')}`
        await Deno.mkdir(sourceDir)
        for (const [contractName, { bytecode, descriptors: { functions } }] of [...source.entries()]) {
            const contractDir = `${sourceDir}/${contractName.replace(/^I?/, 'I')}`
            await Deno.mkdir(contractDir)
            if (bytecode) await Deno.writeTextFile(`${contractDir}/bytecode.ts`, `export const bytecode = '${bytecode}'`)
            // await Deno.writeTextFile(`${contractDir}/mod.ts`, `export * from './bytecode.ts'`, { append: true })
            const functionsDir = `${contractDir}/functions`
            await Deno.mkdir(functionsDir)
            for (const [descriptorName, descriptors] of [...functions.entries()]) {
                const descriptorDir = `${functionsDir}/${descriptorName}`
                await Deno.mkdir(descriptorDir)
                let contents = ''
                if (descriptors.every(({ inputs }) => !inputs.length))
                    contents += `export function ${descriptorName}() { return '${selector(`${descriptorName}()`)}' }`
                await Deno.writeTextFile(`${descriptorDir}/encode.ts`, contents)
            }
        }
    }

}