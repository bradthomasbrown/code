import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { receive } from 'solc/output/schemas/sources/contract/descriptor/receive.ts';

export type Receive = z.infer<typeof receive>