import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { base } from "./base.ts";

export const response = base.and(z.object({ result: z.unknown() }));