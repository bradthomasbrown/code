import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { solcJsonOutputObject } from '../schemas/_solcJsonOutputObject.ts';

export type SolcJsonOutputObject = z.infer<typeof solcJsonOutputObject>