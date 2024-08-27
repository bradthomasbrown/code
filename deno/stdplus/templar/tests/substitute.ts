import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { substitute, SubstitutionRule } from '../lib/mod.ts';
import { transpile } from 'https://deno.land/x/emit@0.40.0/mod.ts'
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/assert_equals.ts';

Deno.test('substitute', async () => {

    // load template
    const code = await Deno.readTextFile(fromFileUrl(import.meta.resolve('./templates/a.ts')))

    // define substitution rules
    const rules: SubstitutionRule[] = [
        { type: 'type', id: 'Foo', content: 'number' },
        { type: 'expression', id: 'foo', content: `3` },
        { type: 'parameter', id: 'barParam', content: `x:number, y:number, z:number` }
    ]

    // apply substitution rules
    const results = substitute(code, rules)
    console.log({ results })

    // transpile the substituted code
    const transpiled = await transpile(`data:application/typescript,${encodeURIComponent(results)}`)

    // import the transpiled code
    const module = await import(`data:application/javascript,${encodeURIComponent(transpiled.values().next().value)}`)

    // assert the results
    assertEquals(module.foo, 3)
    assertEquals(module.bar(5, 7, 11), 23)

})