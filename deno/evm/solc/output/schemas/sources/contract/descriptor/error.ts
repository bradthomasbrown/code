import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { input } from "./~input.ts"

export const error = z.object({
    type: z.literal('error'),
    name: z.string(),
    inputs: input.array()
}).strict()