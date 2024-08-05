import { createSourceMap } from '../../../lib/_createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('ERC20 createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['ERC20.sol'],
        basePath: `${home}/dizzyhavoc/contracts/ERC20`
    })
})

Deno.test('NFTDescriptor createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['NFTDescriptor.sol'],
        basePath: `${home}/v3-periphery/contracts/libraries`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64']
    })
})

Deno.test('NonfungiblePositionManager createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['NonfungiblePositionManager.sol'],
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim']
    })
})

Deno.test('NonfungibleTokenPositionDescriptor createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['NonfungibleTokenPositionDescriptor.sol'],
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`, `${home}/solidity-lib`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64', 'lib/=solidity-lib/']
    })
})

Deno.test('Resolver createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['Resolver.sol'],
        basePath: `${home}/dizzyhavoc/contracts/Resolver`
    })
})

Deno.test('UniswapV2Factory createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['UniswapV2Factory.sol', 'UniswapV2Pair.sol'],
        basePath: `${home}/v2-core/contracts`
    })
})

Deno.test('UniswapV3Factory createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['UniswapV3Factory.sol', 'UniswapV3Pool.sol'],
        basePath: `${home}/v3-core/contracts`
    })
})

Deno.test('UniversalRouter createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['UniversalRouter.sol'],
        basePath: `${home}/universal-router/contracts`,
        includePaths: [`${home}/openzeppelin-contracts/v4.7.0-trim`, `${home}/solmate`, `${home}/permit2`, `${home}/v2-core`, `${home}/v3-core`],
        remappings: ['@openzeppelin=v4.7.0-trim', '@uniswap/=']
    })
})

Deno.test('WETH9 createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['weth9.sol'],
        basePath: `${home}/ds-weth/src`
    })
})