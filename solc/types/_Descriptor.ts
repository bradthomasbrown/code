import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { descriptor } from '../schemas/solcJsonOutput.ts'

export type Descriptor = z.infer<typeof descriptor>