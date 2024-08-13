import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { ExtendedMap } from "map/lib/ExtendedMap.ts";

const m0 = new ExtendedMap(Array(10).fill(0).map((_, i) => [i, String.fromCharCode(i + 97)] as const))
Deno.test('groupBy', () => {
    const m1 = m0.groupBy(v => { try { BigInt(`0x${v}`); return 'hex' } catch (_) { return } } )
    assert((m1.get('hex') ?? []).length == 6)
    console.log(m0, m1)
})