import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { abiInputObject } from './_abiInputObject.ts'

export const abiElementObject = z.object({
    name: z.string().optional(),
    inputs: abiInputObject.array().optional(),
    type: z.string().optional()
})