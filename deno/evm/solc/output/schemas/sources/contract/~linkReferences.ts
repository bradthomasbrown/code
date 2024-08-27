import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { ExtendedMap } from "../../../../../../stdplus/map/lib/ExtendedMap.ts"
import { sources } from "./~sources.ts"

export const linkReferences = z.record(z.string(), sources).transform(r => new ExtendedMap(Object.entries(r)))