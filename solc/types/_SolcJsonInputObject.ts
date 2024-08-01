import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { solcJsonInputObject } from '../schemas/_solcJsonInputObject.ts';

export type SolcJsonInputObject = z.infer<typeof solcJsonInputObject>