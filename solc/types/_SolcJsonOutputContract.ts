import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { contract as solcJsonOutputContract } from "../schemas/solcJsonOutput.ts";

export type SolcJsonOutputContract = z.infer<typeof solcJsonOutputContract>