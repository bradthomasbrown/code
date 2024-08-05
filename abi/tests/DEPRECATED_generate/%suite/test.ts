import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../../solc/lib/DEPRECATED_compile.ts";

Deno.test('WETH9', async () => {
    const targetDir = fromFileUrl(import.meta.resolve('../../../../common/WETH9'))
    const solcJsonInputPath = fromFileUrl(import.meta.resolve('../WETH9/settings.json'))
    const solcJsonOutput = await compile(solcJsonInputPath, targetDir)
    solcJsonOutput.abi('WETH9')
})

Deno.test('UniswapV2Factory', async () => {
    const targetDir = fromFileUrl(import.meta.resolve('../../../../common/@uniswap/v2-core/contracts'))
    const solcJsonInputPath = fromFileUrl(import.meta.resolve('../UniswapV2Factory/settings.json'))
    const solcJsonOutput = await compile(solcJsonInputPath, targetDir)
    solcJsonOutput.abi('UniswapV2Factory')
})

Deno.test('UniswapV3Factory', async () => {
    const targetDir = fromFileUrl(import.meta.resolve('../../../../common/@uniswap/v3-core/contracts'))
    const solcJsonInputPath = fromFileUrl(import.meta.resolve('../UniswapV3Factory/settings.json'))
    const solcJsonOutput = await compile(solcJsonInputPath, targetDir)
    solcJsonOutput.abi('UniswapV3Factory')
})

Deno.test('UniversalRouter', async () => {
    const targetDir = fromFileUrl(import.meta.resolve('../../../../common/@uniswap/universal-router/contracts'))
    const solcJsonInputPath = fromFileUrl(import.meta.resolve('../UniversalRouter/settings.json'))
    const solcJsonOutput = await compile(solcJsonInputPath, targetDir)
    solcJsonOutput.abi('UniversalRouter')
})