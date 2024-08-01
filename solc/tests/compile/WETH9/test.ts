import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { compile } from "../../../lib/compile.ts";

const solcJsonInputPath = fromFileUrl(import.meta.resolve('../../../../common/WETH9/settings.json'))
Deno.test('compilation success', async () => {
    await compile(solcJsonInputPath)
})