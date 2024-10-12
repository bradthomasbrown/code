import { Abi } from "../../../../abi/types/mod.ts";
import { LinkReferences } from "./LinkReference/mod.ts";

export type Bytecode = Readonly<Partial<{
    functionDebugData: unknown;
    object: string;
    opcodes: string;
    sourceMap: unknown;
    generatedSources: unknown;
    linkReferences: LinkReferences;
}>>

export type Evm = Readonly<Partial<{
    assembly: unknown;
    legacyAssembly: unknown;
    bytecode: Bytecode;
    deployedBytecode: unknown;
    methodIdentifiers: unknown;
    gasEstimates: unknown;
}>>

export type Contract = Readonly<Partial<{
    abi: Abi;
    metadata: unknown;
    userdoc: unknown;
    devdoc: unknown;
    ir: unknown;
    irAst: unknown;
    irOptimized: unknown;
    irOptimizedAst: unknown;
    storageLayout: unknown;
    evm: Evm;
}>>

declare const [contracts, source]: Array<Record<string, Contract>>
export type Contracts = typeof contracts;

export type Source = typeof source;
export type Sources = Record<string, Source>