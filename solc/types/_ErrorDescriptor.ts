import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { errorDescriptor } from '../schemas/solcJsonOutput.ts'

export type ErrorDescriptor = z.infer<typeof errorDescriptor>