import { SetMap } from "map/lib/SetMap.ts";

export class GroupableSet<T extends Record<PropertyKey, unknown>> extends Set<T> {

    constructor(...parameters:ConstructorParameters<typeof Set<T>>) {
        super(...parameters)
    }

    groupBy<K extends PropertyKey>(keySelector: (t: T) => K): SetMap<K, Set<T>> {
        const m1 = new SetMap<K, Set<T>>()
        for (const v of this) {
            const k = keySelector(v)
            const vs = m1.get(k)
            if (vs) vs.add(v)
            else m1.set(k, new Set([v]))
        }
        return m1
    }

}