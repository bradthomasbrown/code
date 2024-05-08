import { z } from "zod";
import { base } from "schemas/request/base.ts";
import * as jra from 'lib/mod.ts'

export const byName = base.and(z.object({
  params: z.record(z.string(), jra.schemas.json)
}))