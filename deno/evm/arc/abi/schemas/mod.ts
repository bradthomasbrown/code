import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { repeat } from "../../../stdplus/fp/lib/repeat.ts"
import * as T from "../types/mod.ts";

export const [input, output, component]
: Generator<z.ZodType<T.Input & T.Output & T.Component>>
= repeat(z.object({
  name: z.string(),
  type: z.string(),
  components: z.lazy((): z.ZodType<T.Component[]> => component.array()),
}))

export const receive
: z.ZodType<T.Receive>
= z.object({
  type: z.literal("receive"),
  stateMutability: z.literal("payable"),
}).strict();

export const fallback
: z.ZodType<T.Fallback>
= z.object({
  type: z.literal("fallback"),
  stateMutability: z.enum(["nonpayable", "payable"]),
}).strict();

export const ctor
: z.ZodType<T.Constructor>
= z.object({
  type: z.literal("constructor"),
  inputs: input.array(),
  stateMutability: z.enum(["nonpayable", "payable"]),
}).strict();

export const error
: z.ZodType<T.Error>
= z.object({
  type: z.literal("error"),
  name: z.string(),
  inputs: input.array(),
}).strict();

export const event
: z.ZodType<T.Event>
= z.object({
  type: z.literal("event"),
  name: z.string(),
  inputs: input.and(z.object({ indexed: z.boolean() })).array(),
  anonymous: z.boolean(),
}).strict();

export const fn
: z.ZodType<T.Function>
= z.object({
  type: z.literal("function"),
  name: z.string(),
  inputs: input.array(),
  outputs: output.array(),
  stateMutability: z.enum(["pure", "view", "nonpayable", "payable"]),
}).strict();

export const descriptor
: z.ZodType<T.Descriptor>
= z.union([fn, error, event, ctor, fallback, receive]);

export const [descriptors, abi]
: Generator<z.ZodType<T.Descriptor[]>>
= repeat(descriptor.array())