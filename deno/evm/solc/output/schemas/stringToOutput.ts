import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { output as object } from "solc/output/schemas/objectToOutput.ts"

export const output = z.string().transform(string => object.parse(JSON.parse(string)))