import { MonoidInterface } from "fp/types/MonoidInterface.ts";

export class ExtendedMap<Ka, Va> extends Map<Ka, Va> {

    constructor(...parameters:ConstructorParameters<typeof Map<Ka, Va>>) {
        super(...parameters)
    }

    foldr<B>(f: (a: Va, b: B) => B, b: B): B {
        for (const v of this.values()) b = f(v, b); return b
    }

    foldrWithKey<B>(f: (k: Ka, a: Va, b: B) => B, b: B): B {
        for (const [k, v] of this) b = f(k, v, b); return b
    }

    foldMapWithKey<T>(f: (k: Ka, v: Va) => MonoidInterface<T>, mCtor: new (...p:T[]) => MonoidInterface<T>) {
        return this.foldrWithKey((k, v, m) => m = m.mappend(f(k, v)), new mCtor())
    }

    map<Vb>(f: (v: Va) => Vb): ExtendedMap<Ka, Vb> {
        return this.foldrWithKey((k, v, b) => b.set(k, f(v)), new ExtendedMap<Ka, Vb>())
    }

    mapWithKey<B>(f: (k: Ka, v: Va) => B) {
        return this.foldrWithKey((k, v, b) => b.set(k, f(k, v)), new ExtendedMap<Ka, B>())
    }

    groupBy<Kb extends PropertyKey>(f: (v: Va) => Kb | void): ExtendedMap<Kb, Va[]> {
        return this.foldr((v, b) => (k => k ? b.set(k, (a => (a.push(v), a))(b.get(k) ?? [])) : b)(f(v)), new ExtendedMap<Kb, Va[]>)
    }

}