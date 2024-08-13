import { ExtendedMap } from "map/lib/ExtendedMap.ts";

export class SetMap<Ka, Va extends Set<unknown>> extends ExtendedMap<Ka, Va> {

    constructor(...parameters:ConstructorParameters<typeof Map<Ka, Va>>) {
        super(...parameters)
    }

}