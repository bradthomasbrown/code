import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('ERC20 createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'ERC20.sol',
        basePath: `${home}/dizzyhavoc/contracts/ERC20`
    })
})