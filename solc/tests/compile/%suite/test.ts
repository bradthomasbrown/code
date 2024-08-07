import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('ERC20 compile', async () => {
    const results = await compile({
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: `${home}/dizzyhavoc/contracts/ERC20`
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/ERC20/results.txt')), results)
})

Deno.test('NFTDescriptor compile', async () => {
    const results = await compile({
        targets: { 'NFTDescriptor.sol': ['NFTDescriptor'] },
        basePath: `${home}/v3-periphery/contracts/libraries`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/NFTDescriptor/results.txt')), results)
})

Deno.test('NonfungiblePositionManager compile', async () => {
    const results = await compile({
        targets: { 'NonfungiblePositionManager.sol': ['NonfungiblePositionManager'] },
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim'],
        optimizer: { enabled: true, runs: 200 }
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/NonfungiblePositionManager/results.txt')), results)
})

Deno.test('NonfungibleTokenPositionDescriptor compile', async () => {
    const results = await compile({
        targets: { 'NonfungibleTokenPositionDescriptor.sol': ['NonfungibleTokenPositionDescriptor'] },
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`, `${home}/solidity-lib`],
        remappings: ['@uniswap/lib=solidity-lib', '@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/NonfungibleTokenPositionDescriptor/results.txt')), results)
})

Deno.test('Resolver compile', async () => {
    const results = await compile({
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: `${home}/dizzyhavoc/contracts/Resolver`
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/Resolver/results.txt')), results)
})

Deno.test('UniswapV2Factory compile', async () => {
    const results = await compile({
        targets: { 'UniswapV2Factory.sol': ['UniswapV2Factory'], 'UniswapV2Pair.sol': ['UniswapV2Pair'] },
        basePath: `${home}/v2-core/contracts`
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/UniswapV2Factory/results.txt')), results)
})

Deno.test('UniswapV3Factory compile', async () => {
    const results = await compile({
        targets: { 'UniswapV3Factory.sol': ['UniswapV3Factory'], 'UniswapV3Pool.sol': ['UniswapV3Pool'] },
        basePath: `${home}/v3-core/contracts`,
        optimizer: { enabled: true, runs: 200 }
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/UniswapV3Factory/results.txt')), results)
})

Deno.test('UniversalRouter compile', async () => {
    const results = await compile({
        targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
        basePath: `${home}/universal-router/contracts`,
        includePaths: [`${home}/openzeppelin-contracts/v4.7.0-trim`, `${home}/solmate`, `${home}/permit2`, `${home}/v2-core`, `${home}/v3-core`],
        remappings: ['@openzeppelin=v4.7.0-trim', '@uniswap/='],
        optimizer: { enabled: true, runs: 1000000 },
        viaIR: true
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/UniversalRouter/results.txt')), results)
})

Deno.test('WETH9 compile', async () => {
    const results = await compile({
        targets: { 'weth9.sol': ['WETH9'] },
        basePath: `${home}/ds-weth/src`
    })
    await Deno.writeTextFile(fromFileUrl(import.meta.resolve('../../solcJsonOutput/WETH9/results.txt')), results)
})