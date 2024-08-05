import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('UniversalRouter createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'UniversalRouter.sol',
        basePath: `${home}/universal-router/contracts`,
        includePaths: `${home}/openzeppelin-contracts,${home}/solmate,${home}/permit2,${home}/v2-core,${home}/v3-core`,
        remappings: '@openzeppelin=openzeppelin-contracts,@uniswap/='
    })
})