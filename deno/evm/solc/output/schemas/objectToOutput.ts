import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { sources } from "./sources/mod.ts";

export const output = z.object({
  errors: z.unknown(),
  sources: z.unknown(),
  contracts: sources,
}).partial().strict();
