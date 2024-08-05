import { createSourceMap } from '../../../lib/_createSourceMap.ts'

const home = Deno.env.get('HOME')!

Deno.test('Resolver createSourceMap', async () => {
    await createSourceMap({
        requiredSources: ['Resolver.sol'],
        basePath: `${home}/dizzyhavoc/contracts/Resolver`
    })
})