import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { list as object } from "./objectToList.ts"

export const list = z.string().transform(string => object.parse(JSON.parse(string)))