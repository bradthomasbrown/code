import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { contract } from 'solc/output/schemas/sources/contract/mod.ts';

export type Contract = z.infer<typeof contract>