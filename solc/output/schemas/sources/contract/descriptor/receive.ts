import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const receive = z.object({
    type: z.literal('receive'),
    stateMutability: z.literal('payable')
}).strict()