import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as schema from '../schema/mod.ts'

export type RequestO = z.infer<typeof schema.requestO>