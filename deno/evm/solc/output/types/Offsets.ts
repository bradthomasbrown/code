import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { offsets } from "../schemas/mod.ts";

export type Offsets = z.infer<typeof offsets>;
