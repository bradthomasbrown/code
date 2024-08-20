import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts'

const i = w(import.meta)
const k = i`smartks/`
const u = k.cd`uniswap/`

export const params: Params = {
    targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
    basePath: u`universal-router/contracts`,
    includePaths: [k`openzeppelin/4.7.0`, k`solmate`, u`permit2`, u`v2-core`, u`v3-core`],
    remappings: ['@openzeppelin=4.7.0', '@uniswap/='],
    optimizer: { enabled: true, runs: 1000000 },
    viaIR: true
}

Deno.test('compile UniversalRouter', async () => { await compile(params) })