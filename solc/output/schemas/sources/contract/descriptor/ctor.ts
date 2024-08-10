import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { input } from "solc/output/schemas/sources/contract/descriptor/~input.ts"

export const ctor = z.object({
    type: z.literal('constructor'),
    inputs: input.array(),
    stateMutability: z.enum(['nonpayable', 'payable']),
    payable: z.boolean().optional()
}).strict()