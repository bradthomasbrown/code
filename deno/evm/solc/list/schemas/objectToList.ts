import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { builds } from "./builds.ts"

export const list = z.object({
    builds: builds,
    releases: z.record(z.string(), z.string()).transform(r => new Map(Object.entries(r))),
    latestRelease: z.string() 
}).strict()