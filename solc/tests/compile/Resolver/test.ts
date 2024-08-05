import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('Resolver compile', async () => {
    const results = await compile({
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: `${home}/dizzyhavoc/contracts/Resolver`
    })
    console.log(results)
})