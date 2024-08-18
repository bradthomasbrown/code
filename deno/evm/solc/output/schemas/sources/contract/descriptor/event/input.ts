import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { component } from "solc/output/schemas/sources/contract/descriptor/~component.ts"

export const input = z.object({
    name: z.string(),
    type: z.string(),
    components: component.array().optional(),
    indexed: z.boolean(),
    internalType: z.string().optional()
})