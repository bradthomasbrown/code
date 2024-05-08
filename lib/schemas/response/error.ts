import { z } from "zod";
import { base } from "schemas/response/base.ts";

export const error = base.and(z.object({
  error: z.object({
    code: z.number().int(),
    message: z.string(),
    data: z.unknown().optional()
  })
}))