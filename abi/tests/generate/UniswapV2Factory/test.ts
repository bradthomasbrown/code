import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../../solc/lib/compile.ts";

const solcJsonInputPath = fromFileUrl(import.meta.resolve('../../../../common/@uniswap/v2-core/contracts/settings.json'))
const solcJsonOutput = await compile(solcJsonInputPath)
const abi = solcJsonOutput.abi('UniswapV2Factory')

console.log(abi.signatureComponentsMap())