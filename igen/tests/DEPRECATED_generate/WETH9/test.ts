import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../../solc/lib/DEPRECATED_compile.ts";

const basePath = fromFileUrl(import.meta.resolve('../../../../common/WETH9'))
const solcJsonInputPath = fromFileUrl(import.meta.resolve('./settings.json'))
const solcJsonOutput = await compile({ solcJsonInputPath, basePath })
console.log(solcJsonOutput.toString())
const abi = solcJsonOutput.abi('WETH9')
console.log(abi.signatureComponentsMap())