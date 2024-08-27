import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { descriptors } from '../schemas/mod.ts';

export type Descriptors = z.infer<typeof descriptors>