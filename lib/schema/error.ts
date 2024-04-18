import z from "https://deno.land/x/zod@v3.22.4/index.ts";

export const error = z.object({ code: z.number(), message: z.string() });