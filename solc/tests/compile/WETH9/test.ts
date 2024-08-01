import { compile } from "../../../lib/compile.ts";

const solcJsonOutput = await compile('./settings.json')
const abi = solcJsonOutput.abi('WETH9')
console.log(abi.toString())
console.log(abi.signatureComponentsMap())