import { compile } from '../lib/mod.ts'
import { Params } from '../types/Parameters.ts'
import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts'

export const params: Params = {
    targets: { 'Resolver.sol': ['Resolver'] },
    basePath: fromFileUrl(import.meta.resolve('smartks/dizzyhavoc/Resolver'))
}

Deno.test('compile Resolver', async () => { await compile(params) })