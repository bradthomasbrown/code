import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts';

const i = w(import.meta)
const k = i`smartks/`

export const params: Params = {
    targets: { 'ERC20.sol': ['ERC20'] },
    basePath: k`dizzyhavoc/ERC20`
}

Deno.test('compile ERC20', async () => { await compile(params) })