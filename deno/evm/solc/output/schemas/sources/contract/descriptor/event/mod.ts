import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { input } from "./input.ts"

export const event = z.object({
    type: z.literal('event'),
    name: z.string(),
    inputs: input.array(),
    anonymous: z.boolean()
}).strict()