import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { contracts as source } from "./contracts.ts";

export const sources = z.record(z.string(), source).transform((r) =>
  new Map(Object.entries(r))
);
