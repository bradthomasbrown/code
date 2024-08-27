import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { source } from '../schemas/mod.ts';

export type Source = z.infer<typeof source>