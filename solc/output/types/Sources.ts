import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { sources } from 'solc/output/schemas/sources/mod.ts';

export type Sources = z.infer<typeof sources>