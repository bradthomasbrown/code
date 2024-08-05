import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export const solcListObject = z.object({
    releases: z.record(z.string())
}).strict()

export const solcListObjectFromString = z.string().transform(s => solcListObject.parse(JSON.parse(s)))