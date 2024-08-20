import { assertEquals } from 'https://deno.land/std@0.224.0/assert/assert_equals.ts';
import { zipWith } from '../lib/zipWith.ts';

const xs = [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9]
const ys = [90, 80, 70, 60, 50, 40, 30, 20, 10,  0]

Deno.test('zipWith', () => {
    assertEquals(
        zipWith((x, y) => x + y, xs, ys),
        [90, 81, 72, 63, 54, 45, 36, 27, 18, 9]
    )
})