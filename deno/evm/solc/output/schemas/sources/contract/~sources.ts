import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { ExtendedMap } from "../../../../../../stdplus/map/lib/ExtendedMap.ts"
import { byteOffsets } from "./~byteOffsets.ts"

export const sources = z.record(z.string(), byteOffsets).transform(r => new ExtendedMap(Object.entries(r)))