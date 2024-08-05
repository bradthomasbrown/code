import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('NonfungibleTokenPositionDescriptor createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'NonfungibleTokenPositionDescriptor.sol',
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: `${home}/v3-core,${home}/openzeppelin-contracts,${home}/base64,${home}/solidity-lib`,
        remappings: '@uniswap/=,@openzeppelin=openzeppelin-contracts,base64-sol=base64,lib/=solidity-lib/'
    })
})