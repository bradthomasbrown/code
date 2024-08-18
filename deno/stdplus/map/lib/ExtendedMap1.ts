import { ExtendedMap } from "map/lib/ExtendedMap.ts";
import { MapKey, MapValue } from "map/types/mod.ts";
import { MonoidInterface } from "fp/types/MonoidInterface.ts";

export class ExtendedMap1<K0, V0 extends ExtendedMap<K1, V1>, K1 = MapKey<V0>, V1 =  MapValue<V0>> extends ExtendedMap<K0, V0> {

    constructor(...parameters:ConstructorParameters<typeof ExtendedMap<K0, V0>>) {
        super(...parameters)
    }

    foldMap1WithKey<T>(f: (k0: K0, v0: V0, k1: K1, v1: V1) => MonoidInterface<T>, mCtor: new (...p:T[]) => MonoidInterface<T>) {
        return this.foldMapWithKey((k0, v0) => v0.foldMapWithKey((k1, v1) => f(k0, v0, k1, v1), mCtor), mCtor)
    }

}