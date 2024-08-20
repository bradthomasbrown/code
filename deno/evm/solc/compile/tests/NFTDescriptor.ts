import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts'

const i = w(import.meta)
const k = i`smartks/`
const u = k.cd`uniswap/`

export const params: Params = {
    targets: { 'NFTDescriptor.sol': ['NFTDescriptor'] },
    basePath: u`v3-periphery/contracts/libraries`,
    includePaths: [u`v3-core`, k`openzeppelin/3.4.2`, k`base64`],
    remappings: ['@uniswap/=', '@openzeppelin=3.4.2', 'base64-sol=base64'],
    optimizer: { enabled: true, runs: 200 }
}

Deno.test('compile NFTDescriptor', async () => { await compile(params) })