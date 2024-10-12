import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { sources as contracts } from "./contract/mod.ts";
import * as T from "../types/mod.ts";

const zObject
: z.ZodType<T.Output>
= z.object({
  errors: z.unknown(),
  sources: z.unknown(),
  contracts,
}).partial().strict();

export const output
: z.ZodType<T.Output, z.ZodTypeDef, string | T.Output>
= z.union([z.string(), zObject])
  .transform(x =>
    typeof x == "string"
      ? zObject.parse(JSON.parse(x))
      : x
  )