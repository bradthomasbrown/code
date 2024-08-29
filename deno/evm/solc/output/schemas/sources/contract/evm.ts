import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { bytecode } from "./~bytecode.ts";

export const evm = z.object({
  assembly: z.unknown(),
  legacyAssembly: z.unknown(),
  bytecode: bytecode,
  deployedBytecode: z.unknown(),
  methodIdentifiers: z.unknown(),
  gasEstimates: z.unknown(),
}).partial().strict();
