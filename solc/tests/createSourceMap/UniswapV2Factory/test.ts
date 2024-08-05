import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('UniswapV2Factory createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'UniswapV2Factory.sol,UniswapV2Pair.sol',
        basePath: `${home}/v2-core/contracts`
    })
})