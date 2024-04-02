import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { base } from './base.ts'

export const arrayRequest = base.and(z.object({
  method: z.string(),
  params: z.array(z.unknown()),
}));