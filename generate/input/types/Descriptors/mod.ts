import { Fns } from "generate/input/types/Descriptors/Fns.ts"
import { Events } from "generate/input/types/Descriptors/Events.ts"
import { Errors } from "generate/input/types/Descriptors/Errors.ts"
import { Ctor, Fallback, Receive } from 'solc/output/types/Descriptor/mod.ts'

export type Descriptors = {
    fns: Map<string, Fns>
    events: Map<string, Events>
    errors: Map<string, Errors>
    ctor?: Ctor
    fallback?: Fallback
    receive?: Receive
}