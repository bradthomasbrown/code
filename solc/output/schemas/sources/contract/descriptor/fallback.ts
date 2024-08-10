import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const fallback = z.object({
    type: z.literal('fallback'),
    stateMutability: z.enum(['nonpayable', 'payable']),
    payable: z.boolean().optional()
}).strict()