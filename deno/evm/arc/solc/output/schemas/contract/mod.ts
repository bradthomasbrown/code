import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { repeat } from '../../../../../stdplus/fp/lib/repeat.ts';
import { abi } from "../../../../abi/schemas/mod.ts";
import * as T from "../../types/Contract/mod.ts";
import { linkReferences } from "./linkReference/mod.ts";

export const bytecode
: z.ZodType<T.Bytecode>
= z.object({
  functionDebugData: z.unknown(),
  object: z.string(),
  opcodes: z.string(),
  sourceMap: z.unknown(),
  generatedSources: z.unknown(),
  linkReferences
}).partial().strict()

export const evm
: z.ZodType<T.Evm>
= z.object({
  assembly: z.unknown(),
  legacyAssembly: z.unknown(),
  bytecode,
  deployedBytecode: z.unknown(),
  methodIdentifiers: z.unknown(),
  gasEstimates: z.unknown(),
}).partial().strict()

export const contract
: z.ZodType<T.Contract>
= z.object({
  abi: abi,
  metadata: z.unknown(),
  userdoc: z.unknown(),
  devdoc: z.unknown(),
  ir: z.unknown(),
  irAst: z.unknown(),
  irOptimized: z.unknown(),
  irOptimizedAst: z.unknown(),
  storageLayout: z.unknown(),
  evm,
}).partial().strict();

export const [contracts, source]
: Generator<z.ZodType<T.Contracts & T.Source>>
= repeat(z.record(contract));

export const sources
: z.ZodType<T.Sources>
= z.record(source);