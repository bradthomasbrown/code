import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts';

const i = w(import.meta)
const k = i`smartks/`
const u = k.cd`uniswap/`

export const params: Record<string, Params> = {
    ERC20: { 
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: k`dizzyhavoc/ERC20`
    },
    NFTDescriptor: {
        targets: { 'NFTDescriptor.sol': ['NFTDescriptor'] },
        basePath: u`v3-periphery/contracts/libraries`,
        includePaths: [u`v3-core`, k`openzeppelin/3.4.2`, k`base64`],
        remappings: ['@uniswap/=', '@openzeppelin=3.4.2', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    },
    NonfungiblePositionManager: {
        targets: { 'NonfungiblePositionManager.sol': ['NonfungiblePositionManager'] },
        basePath: u`v3-periphery/contracts`,
        includePaths: [u`v3-core`, k`openzeppelin/3.4.2`],
        remappings: ['@uniswap/=', '@openzeppelin=3.4.2'],
        optimizer: { enabled: true, runs: 200 }
    },
    NonfungibleTokenPositionDescriptor: {
        targets: { 'NonfungibleTokenPositionDescriptor.sol': ['NonfungibleTokenPositionDescriptor'] },
        basePath: u`v3-periphery/contracts`,
        includePaths: [u`v3-core`, k`openzeppelin/3.4.2`, k`base64`, u`lib`],
        remappings: ['@uniswap/=', '@openzeppelin=3.4.2', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    },
    Resolver: {
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: k`dizzyhavoc/Resolver`
    },
    UniswapV2Factory: {
        targets: { 'UniswapV2Factory.sol': ['UniswapV2Factory'], 'UniswapV2Pair.sol': ['UniswapV2Pair'] },
        basePath: u`v2-core/contracts`
    },
    UniswapV3Factory: {
        targets: { 'UniswapV3Factory.sol': ['UniswapV3Factory'], 'UniswapV3Pool.sol': ['UniswapV3Pool'] },
        basePath: u`v3-core/contracts`,
        optimizer: { enabled: true, runs: 200 }
    },
    UniversalRouter: {
        targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
        basePath: u`universal-router/contracts`,
        includePaths: [k`openzeppelin/4.7.0`, k`solmate`, u`permit2`, u`v2-core`, u`v3-core`],
        remappings: ['@openzeppelin=4.7.0', '@uniswap/='],
        optimizer: { enabled: true, runs: 1000000 },
        viaIR: true
    },
    WETH9: {
        targets: { 'weth9.sol': ['WETH9'] },
        basePath: k`weth/src`
    }
}