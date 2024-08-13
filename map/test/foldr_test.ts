import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts'
import { ExtendedMap } from "map/lib/ExtendedMap.ts";

const m0 = new ExtendedMap(Array(10).fill(0).map((_, i) => [i, i ** 2]))
Deno.test('foldr', () => {
    const sum = m0.foldr((v, b) => v + b, 0)
    assert(sum == 285)
    console.log({ m0, sum })
})