import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts'

const i = w(import.meta)
const k = i`smartks/`

export const params: Params = {
    targets: { 'weth9.sol': ['WETH9'] },
    basePath: k`weth/src`
}

Deno.test('compile WETH9', async () => { await compile(params) })