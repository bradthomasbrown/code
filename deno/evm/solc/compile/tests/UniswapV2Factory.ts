import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts'

const i = w(import.meta)
const u = i`smartks/uniswap/`

export const params: Params = {
    targets: { 'UniswapV2Factory.sol': ['UniswapV2Factory'], 'UniswapV2Pair.sol': ['UniswapV2Pair'] },
    basePath: u`v2-core/contracts`
}

Deno.test('compile UniswapV2Factory', async () => { await compile(params) })