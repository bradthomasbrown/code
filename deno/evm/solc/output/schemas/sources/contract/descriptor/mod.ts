import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

export * from "solc/output/schemas/sources/contract/descriptor/~input.ts"
export * from "solc/output/schemas/sources/contract/descriptor/~output.ts"

import { fn } from 'solc/output/schemas/sources/contract/descriptor/fn.ts'
import { event } from 'solc/output/schemas/sources/contract/descriptor/event/mod.ts'
import { error } from 'solc/output/schemas/sources/contract/descriptor/error.ts'
import { ctor } from 'solc/output/schemas/sources/contract/descriptor/ctor.ts'
import { fallback } from 'solc/output/schemas/sources/contract/descriptor/fallback.ts'
import { receive } from 'solc/output/schemas/sources/contract/descriptor/receive.ts'

export { fn, event, error, ctor, fallback, receive }

export const descriptor = z.union([fn, event, error, ctor, fallback, receive])