import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../../solc/lib/compile.ts";

const solcJsonInputPath = fromFileUrl(import.meta.resolve('../../../../common/WETH9/settings.json'))
const solcJsonOutput = await compile(solcJsonInputPath)
const abi = solcJsonOutput.abi('WETH9')

console.log(abi.signatureComponentsMap())