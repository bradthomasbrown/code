import { createSourceMap } from '../../../lib/_createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('NonfungibleTokenPositionDescriptor createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['NonfungibleTokenPositionDescriptor.sol'],
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`, `${home}/solidity-lib`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64', 'lib/=solidity-lib/']
    })
})