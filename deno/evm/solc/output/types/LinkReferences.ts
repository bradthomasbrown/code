import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { linkReferences } from "../schemas/mod.ts";

export type LinkReferences = z.infer<typeof linkReferences>;
