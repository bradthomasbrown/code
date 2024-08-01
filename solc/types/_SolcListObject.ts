import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { solcListObject } from '../schemas/_solcListObject.ts';

export type SolcListObject = z.infer<typeof solcListObject>