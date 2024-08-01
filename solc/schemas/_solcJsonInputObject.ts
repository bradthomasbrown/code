import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const solcJsonInputObject = z.object({
    sources: z.record(z.object({
        urls: z.string().array()
    }))
}).passthrough()