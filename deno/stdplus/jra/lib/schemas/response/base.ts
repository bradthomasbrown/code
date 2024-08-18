import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const base = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.string().or(z.number()).or(z.null()),
});