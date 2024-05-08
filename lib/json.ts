import { z } from "zod";

// https://www.json.org/json-en.html
export type Json = string|number|{ [key:string]:Json }|Json[]|boolean|null
export const json:z.ZodType<Json> = z.lazy(() => z.string()
    .or(z.number())
    .or(z.record(z.string(), json))
    .or(z.array(json))
    .or(z.boolean())
    .or(z.null()))