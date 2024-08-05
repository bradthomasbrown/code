import { createSourceMap } from '../../../lib/createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('WETH9 createSourceMap', async () => {
    await createSourceMap({
        requiredSources: 'weth9.sol',
        basePath: `${home}/ds-weth/src`
    })
})