import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { source as solcJsonOutputSource } from "../schemas/solcJsonOutput.ts";

export type SolcJsonOutputSource = z.infer<typeof solcJsonOutputSource>