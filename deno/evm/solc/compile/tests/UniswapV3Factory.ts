import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts'

const i = w(import.meta)
const u = i`smartks/uniswap/`

export const params: Params = {
    targets: { 'UniswapV3Factory.sol': ['UniswapV3Factory'], 'UniswapV3Pool.sol': ['UniswapV3Pool'] },
    basePath: u`v3-core/contracts`,
    optimizer: { enabled: true, runs: 200 }
}

Deno.test('compile UniswapV3Factory', async () => { await compile(params) })