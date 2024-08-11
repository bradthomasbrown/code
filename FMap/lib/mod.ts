export class FMap<Ka, Va> extends Map<Ka, Va> {

    constructor(...parameters:ConstructorParameters<typeof Map<Ka, Va>>) {
        super(...parameters)
    }

    mapValues<Vb>(f: (v: Va) => Vb): FMap<Ka, Vb> {
        return new FMap([...this.entries()].map(([k, v]) => [k, f(v)]))
    }

    mapKeys<Kb>(f: (k: Ka) => Kb): FMap<Kb, Va> {
        return new FMap([...this.entries()].map(([k, v]) => [f(k), v]))
    }

    mapEntries<Kb, Vb>(f: ([l, r]:[Ka, Va]) => [Kb, Vb]): Map<Kb, Vb> {
        return new FMap([...this.entries()].map(f))
    }

}