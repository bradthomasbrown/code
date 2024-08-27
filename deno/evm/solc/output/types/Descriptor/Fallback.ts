import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { fallback } from '../../schemas/mod.ts'

export type Fallback = z.infer<typeof fallback>