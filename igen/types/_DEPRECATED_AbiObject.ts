import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { abiObject } from '../schemas/_DEPRECATED_abiObject.ts'

export type AbiObject = z.infer<typeof abiObject>