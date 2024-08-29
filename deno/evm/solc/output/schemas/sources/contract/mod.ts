import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { abi } from "./abi.ts";
import { evm } from "./evm.ts";

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
  evm: evm,
}).partial().strict();
