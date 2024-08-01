import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const abiInputObject = z.object({
    name: z.string(),
    type: z.string()
})