import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { byteOffsets } from "solc/output/schemas/sources/contract/~byteOffsets.ts"

export const sources = z.record(z.string(), byteOffsets).transform(r => new Map(Object.entries(r)))