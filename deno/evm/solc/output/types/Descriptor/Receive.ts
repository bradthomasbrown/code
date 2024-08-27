import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { receive } from '../../schemas/mod.ts'

export type Receive = z.infer<typeof receive>