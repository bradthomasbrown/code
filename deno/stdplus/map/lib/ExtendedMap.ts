import { MonoidInterface } from "../../fp/types/MonoidInterface.ts";

export class ExtendedMap<K0, V0> extends Map<K0, V0> {

    constructor(...parameters:ConstructorParameters<typeof Map<K0, V0>>) {
        super(...parameters)
    }

    foldr<V1>(f: (v0: V0, v1: V1) => V1, v1: V1): V1 {
        for (const v0 of this.values()) v1 = f(v0, v1); return v1
    }

    foldrWithKey<V1>(f: (k0: K0, v0: V0, b: V1) => V1, v1: V1): V1 {
        for (const [k0, v0] of this) v1 = f(k0, v0, v1); return v1
    }

    foldMapWithKey<T>(f: (k0: K0, v0: V0) => MonoidInterface<T>, C: new (...ts:T[]) => MonoidInterface<T>) {
        return this.foldrWithKey((k0, v0, m) => m = m.mappend(f(k0, v0)), new C())
    }

    mapWithKey<V1>(f: (k0: K0, v0: V0) => V1): ExtendedMap<K0, V1> {
        return this.foldrWithKey((k0, v0, m1) => m1.set(k0, f(k0, v0)), new ExtendedMap<K0, V1>())
    }

    map<V1>(f: (v0: V0) => V1): ExtendedMap<K0, V1> {
        return this.mapWithKey((_k0, v0) => f(v0))
    }

    groupBy<K1 extends PropertyKey>(f: (v0: V0) => K1 | void): ExtendedMap<K1, V0[]> {
        return this.foldr((v0, b) => (k1 => k1 ? b.set(k1, (v0s => (v0s.push(v0), v0s))(b.get(k1) ?? [])) : b)(f(v0)), new ExtendedMap<K1, V0[]>)
    }

}