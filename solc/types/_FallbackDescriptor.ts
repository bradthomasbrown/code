import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { fallbackDescriptor } from '../schemas/solcJsonOutput.ts'

export type FallbackDescriptor = z.infer<typeof fallbackDescriptor>