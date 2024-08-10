import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { sources } from "solc/output/schemas/sources/contract/~sources.ts"

export const linkReferences = z.record(z.string(), sources).transform(r => new Map(Object.entries(r)))