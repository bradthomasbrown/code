import { z } from "zod";
import { base } from "schemas/response/base.ts";
import { json } from "schemas/mod.ts";

export const result = base.and(z.object({
  result: json
}))