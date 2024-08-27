import { Ctor } from './Ctor.ts';
import { Error } from "./Error.ts";
import { Event } from "./Event.ts"
import { Fallback } from './Fallback.ts';
import { Fn } from './Fn.ts';
import { Receive } from "./Receive.ts";

export type { Ctor, Error, Event, Fallback, Fn, Receive }

export type Descriptor = Ctor | Error | Event | Fallback | Fn | Receive