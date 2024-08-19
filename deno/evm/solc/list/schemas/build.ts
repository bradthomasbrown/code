import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const build = z.object({
    path: z.string(),
    version: z.string(),
    build: z.string(),
    longVersion: z.string(),
    keccak256: z.string(),
    sha256: z.string(),
    urls: z.string().array()
}).strict()