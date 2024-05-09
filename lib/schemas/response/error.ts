import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { base } from "./base.ts";

export const error = base.and(z.object({
  error: z.object({
    code: z.number().int(),
    message: z.string(),
    data: z.unknown().optional()
  })
}))