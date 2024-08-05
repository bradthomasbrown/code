import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('NonfungiblePositionManager createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'NonfungiblePositionManager.sol',
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: `${home}/v3-core,${home}/openzeppelin-contracts`,
        remappings: '@uniswap/=,@openzeppelin=openzeppelin-contracts'
    })
})