import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('UniswapV3Factory compile', async () => {
    const results = await compile({
        targets: { 'UniswapV3Factory.sol': ['UniswapV3Factory'], 'UniswapV3Pool.sol': ['UniswapV3Pool'] },
        basePath: `${home}/v3-core/contracts`,
        optimizer: { enabled: true, runs: 200 }
    })
    console.log(results)
})