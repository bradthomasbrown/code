import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { fn } from '../../schemas/mod.ts'

export type Fn = z.infer<typeof fn>