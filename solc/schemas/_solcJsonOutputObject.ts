import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { abiObject } from '../../abi/schemas/_abiObject.ts'

export const solcJsonOutputObject = z.object({
    contracts: z.record(z.record(z.object({
        abi: abiObject.optional(),
        evm: z.object({
            bytecode: z.object({
                object: z.string().optional()
            }).passthrough().optional()
        }).passthrough().optional()
    }))).optional()
}).passthrough()