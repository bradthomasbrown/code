import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { solcJsonOutput } from '../../../schemas/_solcJsonOutput.ts';

Deno.test('ERC20 solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../ERC20/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('NFTDescriptor solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../NFTDescriptor/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('NonfungiblePositionManager solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../NonfungiblePositionManager/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('NonfungibleTokenPositionDescriptor solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../NonfungibleTokenPositionDescriptor/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('Resolver solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../Resolver/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('UniswapV2Factory solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../UniswapV2Factory/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('UniswapV3Factory solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../UniswapV3Factory/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('UniversalRouter solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../UniversalRouter/results.txt')))
    solcJsonOutput.parse(results)
})

Deno.test('WETH9 solcJsonOutput', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('../WETH9/results.txt')))
    solcJsonOutput.parse(results)
})