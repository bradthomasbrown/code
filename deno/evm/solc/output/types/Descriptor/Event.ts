import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { event } from '../../schemas/mod.ts'

export type Event = z.infer<typeof event>