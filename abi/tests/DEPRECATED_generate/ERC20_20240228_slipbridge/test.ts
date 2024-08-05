import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../../solc/lib/DEPRECATED_compile.ts";

const solcJsonInputPath = fromFileUrl(import.meta.resolve('../../../../common/@dizzyhavoc/contracts/ERC20/settings.json'))
const solcJsonOutput = await compile(solcJsonInputPath)
const abi = solcJsonOutput.abi('ERC20')

await Deno.writeTextFile('./foo.json', JSON.stringify(JSON.parse(solcJsonOutput.toString()), undefined, 4))

console.log(abi.signatureComponentsMap())