import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { eventDescriptor } from '../schemas/solcJsonOutput.ts'

export type EventDescriptor = z.infer<typeof eventDescriptor>