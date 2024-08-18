import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { output } from 'solc/output/schemas/mod.ts';

export type Output = z.infer<typeof output>