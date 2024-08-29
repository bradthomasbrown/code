import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { linkReferences } from "./~linkReferences.ts";

export const bytecode = z.object({
  functionDebugData: z.unknown(),
  object: z.string(),
  opcodes: z.string(),
  sourceMap: z.unknown(),
  generatedSources: z.unknown(),
  linkReferences: linkReferences,
}).partial().strict();
