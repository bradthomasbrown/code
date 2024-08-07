import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

type FunctionFunctionDescriptorInputComponent = {
    name: string
    type: string
    components?: FunctionFunctionDescriptorInputComponent[]
    internalType?: string
}

const functionFunctionDescriptorInputComponent: z.ZodType<FunctionFunctionDescriptorInputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => functionFunctionDescriptorInputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const functionFunctionDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: functionFunctionDescriptorInputComponent.array().optional(),
    internalType: z.string().optional()
}).strict()

type FunctionFunctionDescriptorOutputComponent = {
    name: string
    type: string
    components?: FunctionFunctionDescriptorOutputComponent[]
    internalType?: string
}

const functionFunctionDescriptorOutputComponent: z.ZodType<FunctionFunctionDescriptorOutputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => functionFunctionDescriptorOutputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const functionFunctionDescriptorOutput = z.object({
    name: z.string(),
    type: z.string(),
    components: functionFunctionDescriptorOutputComponent.array().optional(),
    internalType: z.string().optional(),
}).strict()

const functionFunctionDescriptor = z.object({
    type: z.literal('function'),
    name: z.string(),
    inputs: functionFunctionDescriptorInput.array(),
    outputs: functionFunctionDescriptorOutput.array(),
    stateMutability: z.union([
        z.literal('pure'),
        z.literal('view'),
        z.literal('nonpayable'),
        z.literal('payable')
    ]),
    constant: z.boolean().optional(),
    payable: z.boolean().optional()
}).strict()

type ConstructorFunctionDescriptorInputComponent = {
    name: string
    type: string
    components?: ConstructorFunctionDescriptorInputComponent[]
    internalType?: string
}

const constructorFunctionDescriptorInputComponent: z.ZodType<ConstructorFunctionDescriptorInputComponent> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => constructorFunctionDescriptorInputComponent).array().optional(),
    internalType: z.string().optional()
}).strict()

const constructorFunctionDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: constructorFunctionDescriptorInputComponent.array().optional(),
    internalType: z.string().optional()
}).strict()

const constructorFunctionDescriptor = z.object({
    type: z.literal('constructor'),
    inputs: constructorFunctionDescriptorInput.array(),
    stateMutability: z.union([z.literal('nonpayable'), z.literal('payable')]),
    payable: z.boolean().optional()
}).strict()

const receiveFunctionDescriptor = z.object({
    type: z.literal('receive'),
    stateMutability: z.literal('payable')
}).strict()

const fallbackFunctionDescriptor = z.object({
    type: z.literal('fallback'),
    stateMutability: z.union([z.literal('nonpayable'), z.literal('payable')]),
    payable: z.boolean().optional()
}).strict()

const functionDescriptor = z.union([
    functionFunctionDescriptor,
    constructorFunctionDescriptor,
    receiveFunctionDescriptor,
    fallbackFunctionDescriptor
])

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

const eventDescriptorInput = z.object({
    name: z.string(),
    type: z.string(),
    components: eventDescriptorInputComponent.array().optional(),
    indexed: z.boolean(),
    internalType: z.string().optional()
}).strict()

const eventDescriptor = z.object({
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

const errorDescriptor = z.object({
    type: z.literal('error'),
    name: z.string(),
    inputs: errorDescriptorInput.array()
}).strict()

const abiDescriptor = z.union([functionDescriptor, eventDescriptor, errorDescriptor])

const abi = abiDescriptor.array()

const linkReferencesByteOffset = z.object({
    start: z.number(),
    length: z.number()
}).strict()

const linkReferencesByteOffsets = linkReferencesByteOffset.optional().array()

const linkReferencesSources = z.record(linkReferencesByteOffsets.optional())

const linkReferences = z.record(linkReferencesSources.optional())

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

const contract = z.object({
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

const contracts = z.record(contract.optional())

const sources = z.record(contracts.optional())

export const solcJsonOutputFromObject = z.object({
    errors: z.unknown(),
    sources: z.unknown(),
    contracts: sources
}).partial().strict()

const solcJsonOutputFromString = z.string().transform(s => solcJsonOutputFromObject.parse(JSON.parse(s)))

export const solcJsonOutput = solcJsonOutputFromString.or(solcJsonOutputFromObject)