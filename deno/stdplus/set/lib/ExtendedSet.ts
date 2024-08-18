import { MonoidInterface } from "fp/types/MonoidInterface.ts";
import { ExtendedMap } from "map/lib/ExtendedMap.ts";

export class ExtendedSet<V0> extends Set<V0> {

    constructor(...parameters:ConstructorParameters<typeof Set<V0>>) {
        super(...parameters)
    }

    foldr<V1>(f: (v0: V0, v1: V1) => V1, v1: V1): V1 {
        for (const v0 of this) v1 = f(v0, v1); return v1
    }

    foldSet<T>(f: (v0: V0) => MonoidInterface<T>, mCtor: new (...ts:T[]) => MonoidInterface<T>) {
        return this.foldr((v0, m) => m = m.mappend(f(v0)), new mCtor())
    }

    map<V1>(f: (v0: V0) => V1): Set<V1> {
        return this.foldr((v0, s1) => s1.add(f(v0)), new ExtendedSet<V1>())
    }

    groupBy<K extends PropertyKey>(f: (v0: V0) => K | void): ExtendedMap<K, V0[]> {
        return this.foldr((v0, m) => (k => k ? m.set(k, (v0s => (v0s.push(v0), v0s))(m.get(k) ?? [])) : m)(f(v0)), new ExtendedMap<K, V0[]>)
    }

}