import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

type FunctionDescriptorInputComponent = {
    name: string
    type: string
    components?: FunctionDescriptorInputComponent[]
    internalType?: string
}

const functionDescriptorInputComponent: z.ZodType<FunctionDescriptorInputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => functionDescriptorInputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const functionDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: functionDescriptorInputComponent.array().optional(),
    internalType: z.string().optional()
}).strict()

type FunctionDescriptorOutputComponent = {
    name: string
    type: string
    components?: FunctionDescriptorOutputComponent[]
    internalType?: string
}

const functionDescriptorOutputComponent: z.ZodType<FunctionDescriptorOutputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => functionDescriptorOutputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const functionDescriptorOutput = z.object({
    name: z.string(),
    type: z.string(),
    components: functionDescriptorOutputComponent.array().optional(),
    internalType: z.string().optional(),
}).strict()

export const functionDescriptor = z.object({
    type: z.literal('function').or(z.undefined()),
    name: z.string(),
    inputs: functionDescriptorInput.array(),
    outputs: functionDescriptorOutput.array(),
    stateMutability: z.union([
        z.literal('pure'),
        z.literal('view'),
        z.literal('nonpayable'),
        z.literal('payable')
    ]),
    constant: z.boolean().optional(),
    payable: z.boolean().optional()
}).strict()

type ConstructorDescriptorInputComponent = {
    name: string
    type: string
    components?: ConstructorDescriptorInputComponent[]
    internalType?: string
}

const constructorDescriptorInputComponent: z.ZodType<ConstructorDescriptorInputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => constructorDescriptorInputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const constructorDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: constructorDescriptorInputComponent.array().optional(),
    internalType: z.string().optional()
}).strict()

export const constructorDescriptor = z.object({
    type: z.literal('constructor'),
    inputs: constructorDescriptorInput.array(),
    stateMutability: z.union([z.literal('nonpayable'), z.literal('payable')]),
    payable: z.boolean().optional()
}).strict()

export const receiveDescriptor = z.object({
    type: z.literal('receive'),
    stateMutability: z.literal('payable')
}).strict()

export const fallbackDescriptor = z.object({
    type: z.literal('fallback'),
    stateMutability: z.union([z.literal('nonpayable'), z.literal('payable')]),
    payable: z.boolean().optional()
}).strict()

type EventDescriptorInputComponent = {
    name: string
    type: string
    components?: EventDescriptorInputComponent[]
    internalType?: string
}

const eventDescriptorInputComponent: z.ZodType<EventDescriptorInputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => eventDescriptorInputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

export const eventDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: eventDescriptorInputComponent.array().optional(),
    indexed: z.boolean(),
    internalType: z.string().optional()
}).strict()

export const eventDescriptor = z.object({
    type: z.literal('event'),
    name: z.string(),
    inputs: eventDescriptorInput.array(),
    anonymous: z.boolean()
}).strict()

type ErrorDescriptorInputComponent = {
    name: string
    type: string
    components?: ErrorDescriptorInputComponent[]
    internalType?: string
}

const errorDescriptorInputComponent: z.ZodType<ErrorDescriptorInputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => errorDescriptorInputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const errorDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: errorDescriptorInputComponent.array().optional(),
    internalType: z.string().optional()
}).strict()

export const errorDescriptor = z.object({
    type: z.literal('error'),
    name: z.string(),
    inputs: errorDescriptorInput.array()
}).strict()

export const descriptor = z.union([
    functionDescriptor, 
    eventDescriptor, 
    errorDescriptor, 
    constructorDescriptor, 
    fallbackDescriptor, 
    receiveDescriptor
])

const abi = descriptor.array()

const linkReferenceByteOffset = z.object({
    start: z.number(),
    length: z.number()
}).strict()

const linkReferenceByteOffsets = linkReferenceByteOffset.array()

const linkReferenceSources = z.record(z.string(), linkReferenceByteOffsets).transform(r => new Map(Object.entries(r)))

export const linkReferences = z.record(z.string(), linkReferenceSources).transform(r => new Map(Object.entries(r)))

const bytecode = z.object({
    functionDebugData: z.unknown(),
    object: z.string(),
    opcodes: z.string(),
    sourceMap: z.unknown(),
    generatedSources: z.unknown(),
    linkReferences: linkReferences
}).partial().strict()

const evm = z.object({
    assembly: z.unknown(),
    legacyAssembly: z.unknown(),
    bytecode: bytecode,
    deployedBytecode: z.unknown(),
    methodIdentifiers: z.unknown(),
    gasEstimates: z.unknown()
}).partial().strict()

export const contract = z.object({
    abi: abi,
    metadata: z.unknown(),
    userdoc: z.unknown(),
    devdoc: z.unknown(),
    ir: z.unknown(),
    irAst: z.unknown(),
    irOptimized: z.unknown(),
    irOptimizedAst: z.unknown(),
    storageLayout: z.unknown(),
    evm: evm
}).partial().strict()

export const source = z.record(z.string(), contract).transform(r => new Map(Object.entries(r)))

const sources = z.record(z.string(), source).transform(r => new Map(Object.entries(r)))

export const solcJsonOutputFromObject = z.object({
    errors: z.unknown(),
    sources: z.unknown(),
    contracts: sources
}).partial().strict()

const solcJsonOutputFromString = z.string().transform(s => solcJsonOutputFromObject.parse(JSON.parse(s)))

export const solcJsonOutput = solcJsonOutputFromString.or(solcJsonOutputFromObject)