import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { fn } from 'solc/output/schemas/sources/contract/descriptor/fn.ts';

export type Fn = z.infer<typeof fn>