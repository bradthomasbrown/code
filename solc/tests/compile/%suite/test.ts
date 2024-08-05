import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('ERC20 compile', async () => {
    await compile({
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: `${home}/dizzyhavoc/contracts/ERC20`
    })
})

Deno.test('NFTDescriptor compile', async () => {
    await compile({
        targets: { 'NFTDescriptor.sol': ['NFTDescriptor'] },
        basePath: `${home}/v3-periphery/contracts/libraries`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    })
})

Deno.test('NonfungiblePositionManager compile', async () => {
    await compile({
        targets: { 'NonfungiblePositionManager.sol': ['NonfungiblePositionManager'] },
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim'],
        optimizer: { enabled: true, runs: 200 }
    })
})

Deno.test('NonfungibleTokenPositionDescriptor compile', async () => {
    await compile({
        targets: { 'NonfungibleTokenPositionDescriptor.sol': ['NonfungibleTokenPositionDescriptor'] },
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`, `${home}/solidity-lib`],
        remappings: ['@uniswap/lib=solidity-lib', '@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    })
})

Deno.test('Resolver compile', async () => {
    await compile({
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: `${home}/dizzyhavoc/contracts/Resolver`
    })
})

Deno.test('UniswapV2Factory compile', async () => {
    await compile({
        targets: { 'UniswapV2Factory.sol': ['UniswapV2Factory'], 'UniswapV2Pair.sol': ['UniswapV2Pair'] },
        basePath: `${home}/v2-core/contracts`
    })
})

Deno.test('UniswapV3Factory compile', async () => {
    await compile({
        targets: { 'UniswapV3Factory.sol': ['UniswapV3Factory'], 'UniswapV3Pool.sol': ['UniswapV3Pool'] },
        basePath: `${home}/v3-core/contracts`,
        optimizer: { enabled: true, runs: 200 }
    })
})

Deno.test('UniversalRouter compile', async () => {
    await compile({
        targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
        basePath: `${home}/universal-router/contracts`,
        includePaths: [`${home}/openzeppelin-contracts/v4.7.0-trim`, `${home}/solmate`, `${home}/permit2`, `${home}/v2-core`, `${home}/v3-core`],
        remappings: ['@openzeppelin=v4.7.0-trim', '@uniswap/='],
        optimizer: { enabled: true, runs: 1000000 },
        viaIR: true
    })
})

Deno.test('WETH9 compile', async () => {
    await compile({
        targets: { 'weth9.sol': ['WETH9'] },
        basePath: `${home}/ds-weth/src`
    })
})