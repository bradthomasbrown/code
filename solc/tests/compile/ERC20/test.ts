import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('ERC20 compile', async () => {
    const results = await compile({
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: `${home}/dizzyhavoc/contracts/ERC20`
    })
    console.log(results)
})