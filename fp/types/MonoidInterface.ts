export interface MonoidInterface<A> {
    mempty: A
    value: A | undefined
    mappend(a: MonoidInterface<A>): MonoidInterface<A>
}