import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../lib/DEPRECATED_compile.ts";

// const solcJsonInputPath = fromFileUrl(import.meta.resolve('../../../../common/WETH9/settings.json'))
// Deno.test('compilation success', async () => {
//     await compile(solcJsonInputPath)
// })

// const code = await Deno.readTextFile(`${Deno.env.get('HOME')}/ds-weth/src/weth9.sol`)

// const foo = new Map([
//     ['weth9.sol', await Deno.readTextFile(`${Deno.env.get('HOME')}/ds-weth/src/weth9.sol`)],
//     ['@uniswap/A/B.sol', await Deno.readTextFile(`${Deno.env.get('HOME')}/Uniswap/A/B.sol`)],
//     ['@uniswap/A/C.sol', await Deno.readTextFile(`${Deno.env.get('HOME')}/Uniswap/A/C.sol`)],
//     ['@uniswap/A/D.sol', await Deno.readTextFile(`${Deno.env.get('HOME')}/Uniswap/A/D.sol`)]
// ])

// const bar = await Promise.all(['B.sol', 'C.sol', 'D.sol'].map(async x => [`@uniswap/A/${x}`, await Deno.readTextFile(`${Deno.env.get('HOME')}/Uniswap/A/${x}`)]))

// async function goo({ dir, globs, remaps }:{ dir:string, globs:string[], remaps:[string,string][] }):Promise<string[][]> {
//     return []
// }

// const home = Deno.env.get('HOME')!
// const gaz = goo({ dir: `${home}/ds-weth/src`, globs: ['*'], remaps: [] })
// const gar = goo({ dir: `${home}`, globs: ['Uniswap/**/*.sol', 'ds-weth/**/*.sol', 'Openzeppelin/**/*.sol'], remaps: [['Uniswap', '@uniswap'], ['Openzeppelin', '@openzeppelin']] })

