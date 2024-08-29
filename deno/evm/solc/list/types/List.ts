import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { list } from "../schemas/objectToList.ts";

export type List = z.infer<typeof list>;
