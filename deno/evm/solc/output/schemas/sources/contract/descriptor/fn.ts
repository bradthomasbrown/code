import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { input, output } from "./mod.ts"

export const fn = z.object({
    type: z.literal('function').or(z.undefined()),
    name: z.string(),
    inputs: input.array(),
    outputs: output.array(),
    stateMutability: z.enum(['pure', 'view', 'nonpayable', 'payable']),
    constant: z.boolean().optional(),
    payable: z.boolean().optional()
}).strict()