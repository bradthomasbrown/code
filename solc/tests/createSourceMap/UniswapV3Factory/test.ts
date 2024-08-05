import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('UniswapV3Factory createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'UniswapV3Factory.sol,UniswapV3Pool.sol',
        basePath: `${home}/v3-core/contracts`
    })
})