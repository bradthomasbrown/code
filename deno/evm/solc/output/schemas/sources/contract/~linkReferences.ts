import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { sources } from "./~sources.ts"

export const linkReferences = z.record(z.string(), sources).transform(r => new Map(Object.entries(r)))