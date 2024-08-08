import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { solcJsonOutput } from '../schemas/solcJsonOutput.ts';

export type SolcJsonOutputObject = z.infer<typeof solcJsonOutput>