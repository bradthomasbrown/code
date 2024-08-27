import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { base } from "./base.ts";
import { json } from '../json.ts'

export const result = base.and(z.object({
  result: json
}))