import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { linkReferences } from 'solc/output/schemas/sources/contract/~linkReferences.ts';

export type LinkReferences = z.infer<typeof linkReferences>