import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts'
import { ExtendedMap } from "map/lib/ExtendedMap.ts";

const m0 = new ExtendedMap(Array(10).fill(0).map((_, i) => [i, i % 2 == 0] as const))
const square = (b: boolean) => String(b)
Deno.test('map', () => {
    const m1 = m0.map(square)
    for (const [k, v] of m1) assert(v === String(m0.get(k)))
    console.log(m0, m1)
})