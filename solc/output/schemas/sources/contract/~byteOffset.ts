import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const byteOffset = z.object({
    start: z.number(),
    length: z.number()
}).strict()