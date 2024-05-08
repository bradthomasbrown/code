import { z } from "zod";
import { base } from "schemas/request/base.ts";
import * as jra from 'lib/mod.ts'

export const byPosition = base.and(z.object({
  params: z.array(jra.schemas.json)
}))