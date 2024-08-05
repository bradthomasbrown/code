import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('UniswapV2Factory compile', async () => {
    const results = await compile({
        targets: { 'UniswapV2Factory.sol': ['UniswapV2Factory'], 'UniswapV2Pair.sol': ['UniswapV2Pair'] },
        basePath: `${home}/v2-core/contracts`
    })
    console.log(results)
})