import { MonoidInterface } from "fp/types/MonoidInterface.ts";

export class MonoidList<T> implements MonoidInterface<T[]> {

    mempty: []
    value: T[] | undefined;

    constructor(v?: T[]) {
        this.mempty = []
        this.value = v ?? this.mempty
    }

    mappend(a: MonoidInterface<T[]>): MonoidInterface<T[]> {
        return new MonoidList([...(this.value ?? []), ...(a.value ?? [])])
    }

}