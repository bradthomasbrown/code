import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { ctor } from 'solc/output/schemas/sources/contract/descriptor/ctor.ts';

export type Ctor = z.infer<typeof ctor>