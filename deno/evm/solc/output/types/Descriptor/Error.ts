import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { error } from '../../schemas/mod.ts';

export type Error = z.infer<typeof error>