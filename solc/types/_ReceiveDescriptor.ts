import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { receiveDescriptor } from '../schemas/solcJsonOutput.ts'

export type ReceiveDescriptor = z.infer<typeof receiveDescriptor>