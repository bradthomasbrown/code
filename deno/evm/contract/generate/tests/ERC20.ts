import { load } from '../../../solc/compile/fixtures/lib/load.ts'
import { params } from '../../../solc/compile/tests/ERC20_test.ts'
import { compile } from '../../../solc/compile/lib/mod.ts'

const foo = await load('ERC20', () => compile(params))

Deno.test('ERC20 generate', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('./results.txt')))
    solcJsonOutput.parse(results)
})