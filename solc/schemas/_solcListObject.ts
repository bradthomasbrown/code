import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

const build = z.object({
    path: z.string(),
    version: z.string(),
    build: z.string(),
    longVersion: z.string(),
    keccak256: z.string(),
    sha256: z.string(),
    urls: z.string().array()
}).strict()

const builds = build.optional().array()

export const solcListFromObject = z.object({
    builds: builds,
    releases: z.record(z.string(), z.string()).transform(r => new Map(Object.entries(r))),
    latestRelease: z.string() 
}).strict()

const solcListFromString = z.string().transform(s => solcListFromObject.parse(JSON.parse(s)))

export const solcList = solcListFromString.or(solcListFromObject)