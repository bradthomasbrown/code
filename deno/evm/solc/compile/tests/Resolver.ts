import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts';

const i = w(import.meta)
const k = i`smartks/`

export const params: Params = {
    targets: { 'Resolver.sol': ['Resolver'] },
    basePath: k`dizzyhavoc/Resolver`
}

Deno.test('compile Resolver', async () => { await compile(params) })