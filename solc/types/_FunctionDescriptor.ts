import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { functionDescriptor } from '../schemas/solcJsonOutput.ts'

export type FunctionDescriptor = z.infer<typeof functionDescriptor>