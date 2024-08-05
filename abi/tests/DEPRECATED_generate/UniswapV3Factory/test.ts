import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../../solc/lib/DEPRECATED_compile.ts";

const solcJsonInputPath = fromFileUrl(import.meta.resolve('./settings.json'))
const basePath = fromFileUrl(import.meta.resolve('../../../../common/@uniswap/v3-core/contracts'))
const solcJsonOutput = await compile({ solcJsonInputPath, basePath })
console.log(solcJsonOutput.toString())
const abi = solcJsonOutput.abi('UniswapV3Factory')
console.log(abi.signatureComponentsMap())