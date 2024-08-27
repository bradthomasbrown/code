import { $E, $T } from '../../lib/mod.ts'

type Foo = $T<number, `Foo`>

export const foo: Foo = $E<Foo>`foo`

export function bar($P:Foo&`barParam`): Foo
export function bar(...ps: Foo[]) {
    return ps.reduce((p, c) => p + c, 0)
}