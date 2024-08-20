import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { contract } from "./contract/mod.ts"

export const contracts = z.record(z.string(), contract).transform(r => new Map(Object.entries(r)))