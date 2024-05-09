import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { base } from "./base.ts";
import * as jra from '../../mod.ts'

export const byName = base.and(z.object({
  params: z.record(z.string(), jra.schemas.json)
}))