// interface MonoidConstructor<A> {
//     new (): MonoidInterface<A>
// }

interface MonoidConstructor<A> {
    new (...parameters: A[]): MonoidInterface<A>
}

interface MonoidInterface<A> {
    mempty: A
    value: A | undefined
    mappend(a: MonoidInterface<A>): MonoidInterface<A>
}   

// function createMonoid<A>(ctor: MonoidConstructor<A>): MonoidInterface<A> {
//     return new ctor()
// }

function createMonoid<A>(ctor: MonoidConstructor<A>, ...parameters: A[]): MonoidInterface<A> {
    return new ctor(...parameters)
}

interface UriToKind<A> {
    Monoid: MonoidInterface<A>
}

class MonoidSum implements MonoidInterface<number> {

    mempty: 0
    value: number | undefined

    constructor() {
        this.mempty = 0
        this.value = undefined
    }

    mappend(a: MonoidInterface<number>) {
        if (this.value && a.value) { this.value += a.value; return this }
        else if (this.value && !a.value) { return this }
        else if (!this.value && a.value) { this.value = a.value; return this }
        else if (!this.value && !a.value) { return this }
        else { return this }
    }
     
}

type Kind<Uri extends keyof UriToKind<A>, A> = UriToKind<A>[Uri]

export class ExtendedMap<Ka, Va> extends Map<Ka, Va> {

    constructor(...parameters:ConstructorParameters<typeof Map<Ka, Va>>) {
        super(...parameters)
    }

    map<Vb>(f: (v: Va) => Vb): ExtendedMap<Ka, Vb> {
        const m1 = new ExtendedMap<Ka, Vb>()
        for (const [k, v] of this) m1.set(k, f(v))
        return m1
    }

    groupBy<Kb extends PropertyKey>(keySelector: (v: Va) => Kb | void): ExtendedMap<Kb, Va[]> {
        const m1 = new ExtendedMap<Kb, Va[]>()
        for (const v of this.values()) {
            const k = keySelector(v)
            if (!k) continue
            const vs = m1.get(k)
            if (vs) vs.push(v)
            else m1.set(k, [v])
        }
        return m1
    }

    foldr<B>(f: (a: Va, b: B) => B, b: B): B {
        for (const v of this.values()) b = f(v, b)
        return b
    }

    foldrWithKey<B>(f: (k: Ka, a: Va, b: B) => B, b: B): B {
        for (const [k, v] of this) b = f(k, v, b)
        return b
    }

    mapWithKey<B>(f: (k: Ka, a: Va) => B) {
        const m1 = new ExtendedMap<Ka, B>()
        for (const [k, v] of this) m1.set(k, f(k, v))
        return m1
    }

    foldMapWithKey<T>(mCtor: MonoidConstructor<T>, ...mCtorParams:T[]) {
        return (f: (k: Ka, v: Va) => MonoidInterface<T>) =>
            this.foldrWithKey((k, v, m) => m = m.mappend(f(k, v)), new mCtor(...mCtorParams))
    }

}

const foo = new ExtendedMap([
    ['s0', new ExtendedMap([
        ['l0', 'v0'],
        ['l1', 'v1']
    ])],
    ['s1', new ExtendedMap([
        ['l2', 'v0'],
        ['l3', 'v1']
    ])]
])

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


const faz = <K, A>(k: K, a: A) => {
    return createMonoid<[K, A][]>(MonoidList, [[k, a]])
}

// const boo = createMonoid(MonoidSum)

const baz = createMonoid<string[][]>(MonoidList)

// console.log(faz('f', 'b'))

// const bar = foo.foldMapWithKey<string[][]>(MonoidList, [])((k, a) =>
//     createMonoid(MonoidList, a.foldrWithKey<[string, string][]>((l, _, b) => (b.push([k, l]), b), [])))
const bar = foo.foldMapWithKey<string[][]>(MonoidList, [])((k, v) =>
    v.foldrWithKey((l, _, m) =>
        m.mappend(createMonoid<string[][]>(MonoidList, [[k, l]])),
        createMonoid<string[][]>(MonoidList)))


// outer map foldMapWithKey, tell it the monoid type, then give it the monoid class and init value
// then give it a function f that will operator over every k v and return m.mappend(f(k, v)))
// except here, v is the inner map, so we foldMapWith key that as well, giving it the monoid type then class and init
// then give it a function g that will operate over every k v of the inner map and return m.mappend(f(k, v))
// and so this function just needs to create a monoid, same type then class but the init is where we do our logic
// for that last one, we don't need to give it a type, it is inferred from the init [[k, l]]
const boo = foo.foldMapWithKey<string[][]>(MonoidList, [])((k, v) =>
    v.foldMapWithKey<string[][]>(MonoidList, [])(l =>
        createMonoid(MonoidList, [[k, l]])))

console.log({ foo, bar, boo })