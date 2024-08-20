import { compile } from '../lib/mod.ts'

const edgeCase = 'UniswapV3Factory'

Deno.test(`compile ${edgeCase}`, async () => {
    const { params } = await import('./params.ts')
    await compile(params[edgeCase])
})