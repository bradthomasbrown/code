import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const solcListObject = z.object({
    builds: z.object({
        path: z.string(),
        version: z.string(),
        build: z.string(),
        longVersion: z.string(),
        keccak256: z.string(),
        sha256: z.string(),
        urls: z.string().array()
    }).array(),
    releases: z.record(z.string()),
    latestRelease: z.string() 
}).strict()

export const solcListObjectFromString = z.string().transform(s => solcListObject.parse(JSON.parse(s)))