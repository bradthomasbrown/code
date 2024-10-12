type Plenum = { [K in PropertyKey]: Plenum }
type Foo<A, B, C> = A extends B ? C : A
type Literal<T, P extends PropertyKey = PropertyKey> = Foo<P, T, Plenum>

type Baz<T extends string, Acc extends unknown[] = []>
    = T extends `${infer Head}${infer Tail}`
        ? Baz<Tail, [...Acc, Head]>
        : Acc

type Bar = `${0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn}`

type Boo<T> = T extends `${string}${infer Tail}` ? Tail : never

type Far = Boo<Bar>


declare const _s: unique symbol