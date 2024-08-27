import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { ctor } from '../../schemas/mod.ts';

export type Ctor = z.infer<typeof ctor>