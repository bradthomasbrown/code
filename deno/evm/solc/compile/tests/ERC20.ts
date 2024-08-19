import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts'

export const params: Params = {
    targets: { 'ERC20.sol': ['ERC20'] },
    basePath: fromFileUrl(import.meta.resolve('smartks/dizzyhavoc/ERC20'))
}

Deno.test('compile ERC20', async () => { await compile(params) })