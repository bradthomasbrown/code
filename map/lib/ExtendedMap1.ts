import { ExtendedMap } from "./ExtendedMap.ts";

interface MonoidConstructor<A> {
    new (...parameters: A[]): MonoidInterface<A>
}

interface MonoidInterface<A> {
    mempty: A
    value: A | undefined
    mappend(a: MonoidInterface<A>): MonoidInterface<A>
}   

function createMonoid<A>(ctor: MonoidConstructor<A>, ...parameters: A[]): MonoidInterface<A> {
    return new ctor(...parameters)
}

class MonoidList<T> implements MonoidInterface<T[]> {

    mempty: []
    value: T[] | undefined

    constructor(...[value]: [T[]]) {
        this.mempty = []
        this.value = value
    }

    mappend(a: MonoidInterface<T[]>) {
        if (this.value && a.value) { this.value.push(...a.value); return this }
        else if (this.value && !a.value) { return this }
        else if (!this.value && a.value) { this.value = a.value; return this }
        else if (!this.value && !a.value) { return this }
        else { return this }
    }
     
}

interface UriToKind<A> {
    Monoid: MonoidInterface<A>
}

type Kind<Uri extends keyof UriToKind<A>, A> = UriToKind<A>[Uri]

export class ExtendedMap1<K0, V0 extends ExtendedMap<K1, V1>, K1 = MapKey<V0>, V1 =  MapValue<V0>> extends ExtendedMap<K0, V0> {

    constructor(...parameters:ConstructorParameters<typeof ExtendedMap<K0, V0>>) {
        super(...parameters)
    }

    foldMapsWithKeys<T>(M: (...v:T[]) => Kind<'Monoid', T>) {
        return (f: (k0: K0, v0: V0, k1: K1, v1: V1, m: Kind<'Monoid', T>) => Kind<'Monoid', T>) =>
            this.foldMapWithKey(M)((k0, v0) => v0.foldrWithKey((k1, v1, m) => m.mappend(f(k0, v0, k1, v1, m)), M()))
    }

}

const foo = new ExtendedMap1([
    ['s0', new ExtendedMap([
        ['l0', 'v0'],
        ['l1', 'v1']
    ])],
    ['s1', new ExtendedMap([
        ['l2', 'v0'],
        ['l3', 'v1']
    ])]
])

type Foo = typeof foo
type MapKey<T> = T extends Map<infer K, infer V> ? K : never
type MapValue<T> = T extends Map<infer K, infer V> ? V : never

const bar = (...v:[string, string][][]) => createMonoid<[string, string][]>(MonoidList, ...v)
const baz = foo.foldMapsWithKeys(bar)((k0, _v0, k1, _v1, m) => m.mappend(bar([[k0, k1]])))