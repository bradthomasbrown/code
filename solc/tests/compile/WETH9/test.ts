import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('WETH9 compile', async () => {
    const results = await compile({
        targets: { 'weth9.sol': ['WETH9'] },
        basePath: `${home}/ds-weth/src`
    })
    console.log(results)
})