import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { byteOffsets } from "./~byteOffsets.ts"

export const sources = z.record(z.string(), byteOffsets).transform(r => new Map(Object.entries(r)))