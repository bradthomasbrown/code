import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { constructorDescriptor } from '../schemas/solcJsonOutput.ts'

export type ConstructorDescriptor = z.infer<typeof constructorDescriptor>