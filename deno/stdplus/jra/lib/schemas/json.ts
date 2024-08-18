import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { Json } from "../types/Json.ts";

export const json:z.ZodType<Json> = z.lazy(() => z.string()
    .or(z.number())
    .or(z.record(z.string(), json))
    .or(z.array(json))
    .or(z.boolean())
    .or(z.null()))