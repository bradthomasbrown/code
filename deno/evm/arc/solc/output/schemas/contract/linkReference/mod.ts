import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { repeat } from "../../../../../../stdplus/fp/lib/repeat.ts";
import * as T from "../../../types/Contract/LinkReference/mod.ts";

export const byteOffset
: z.ZodType<T.ByteOffset>
= z.object({
    start: z.number(),
    length: z.number(),
}).strict();

export const byteOffsets
: z.ZodType<T.ByteOffsets>
= byteOffset.array()

export const library
: z.ZodType<T.Library>
= byteOffsets

export const [libraries, source]
: Generator<z.ZodType<T.Libraries & T.Source>>
= repeat(z.record(library))

export const [sources, linkReferences]
: Generator<z.ZodType<T.Sources & T.LinkReferences>>
= repeat(z.record(source))