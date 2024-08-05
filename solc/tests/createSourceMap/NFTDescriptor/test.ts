import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('NFTDescriptor createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'NFTDescriptor.sol',
        basePath: `${home}/v3-periphery/contracts/libraries`,
        includePaths: `${home}/v3-core,${home}/openzeppelin-contracts,${home}/base64`,
        remappings: '@uniswap/=,@openzeppelin=openzeppelin-contracts,base64-sol=base64'
    })
})