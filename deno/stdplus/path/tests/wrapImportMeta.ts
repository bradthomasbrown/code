import { assertEquals } from 'https://deno.land/std@0.224.0/assert/assert_equals.ts';
import { wrapImportMeta } from '../lib/wrapImportMeta.ts'
import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';

Deno.test('intuitive', () => {
    const wrappedImportMeta = wrapImportMeta(import.meta)
    const baseResolverA = wrappedImportMeta.baseResolver('./A/')
    const baseResolverB = baseResolverA.cd('../B/')
    const pathA = baseResolverA.resolve('a.ts')
    const pathB = baseResolverB.resolve('b.ts')
    assertEquals(
        [pathA, pathB],
        [
            fromFileUrl(import.meta.resolve('./A/a.ts')),
            fromFileUrl(import.meta.resolve('./B/b.ts'))
        ]
    )
})

Deno.test('concise', () => {
    const i = wrapImportMeta(import.meta)
    const A = i`./A/`
    const B = A.cd`../B/`
    const pathA = A`a.ts`
    const pathB = B`b.ts`
    assertEquals(
        [pathA, pathB],
        [
            fromFileUrl(import.meta.resolve('./A/a.ts')),
            fromFileUrl(import.meta.resolve('./B/b.ts'))
        ]
    )
})