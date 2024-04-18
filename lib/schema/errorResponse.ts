import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { base } from "./base.ts";
import { error } from './error.ts'

export const errorResponse = base.and(z.object({ error }));