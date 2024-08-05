import { createSourceMap } from '../../../lib/_createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('NonfungiblePositionManager createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['NonfungiblePositionManager.sol'],
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim']
    })
})