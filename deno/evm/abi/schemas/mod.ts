import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import {
    Abi,
    Descriptors,
    Descriptor,
    Function,
    Event,
    Error,
    Constructor,
    Fallback,
    Receive,
    Input,
    Output
} from "../types/mod.ts";

export const input: z.ZodType<Input> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => input.array())
}).strict()

export const output: z.ZodType<Output> = input

export const receive: z.ZodType<Receive> = z.object({
    type: z.literal('receive'),
    stateMutability: z.literal('payable')
}).strict()

export const fallback: z.ZodType<Fallback> = z.object({
    type: z.literal('fallback'),
    stateMutability: z.enum(['nonpayable', 'payable'])
}).strict()

export const ctor: z.ZodType<Constructor> = z.object({
    type: z.literal('constructor'),
    inputs: input.array(),
    stateMutability: z.enum(['nonpayable', 'payable'])
}).strict()

export const error: z.ZodType<Error> = z.object({
    type: z.literal('error'),
    name: z.string(),
    inputs: input.array()
}).strict()

export const event: z.ZodType<Event> = z.object({
    type: z.literal('event'),
    name: z.string(),
    inputs: input.and(z.object({ indexed: z.boolean() })).array(),
    anonymous: z.boolean()
}).strict()

export const fn: z.ZodType<Function> = z.object({
    type: z.literal('function'),
    name: z.string(),
    inputs: input.array(),
    outputs: output.array(),
    stateMutability: z.enum(['pure', 'view', 'nonpayable', 'payable'])
}).strict()

export const descriptor: z.ZodType<Descriptor> = z.union([fn, error, event, ctor, fallback, receive])

export const descriptors: z.ZodType<Descriptors> = descriptor.array()

export const abi: z.ZodType<Abi> = descriptors