import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export * from "./~input.ts"
export * from "./~output.ts"

import { fn } from './fn.ts'
import { event } from './event/mod.ts'
import { error } from './error.ts'
import { ctor } from './ctor.ts'
import { fallback } from './fallback.ts'
import { receive } from './receive.ts'

export { fn, event, error, ctor, fallback, receive }

export const descriptor = z.union([fn, event, error, ctor, fallback, receive])