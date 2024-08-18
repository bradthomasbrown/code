import { Ctor } from 'solc/output/types/Descriptor/Ctor.ts';
import { Error } from "solc/output/types/Descriptor/Error.ts";
import { Event } from "solc/output/types/Descriptor/Event.ts"
import { Fallback } from 'solc/output/types/Descriptor/Fallback.ts';
import { Fn } from 'solc/output/types/Descriptor/Fn.ts';
import { Receive } from "solc/output/types/Descriptor/Receive.ts";

export type { Ctor, Error, Event, Fallback, Fn, Receive }

export type Descriptor = Ctor | Error | Event | Fallback | Fn | Receive