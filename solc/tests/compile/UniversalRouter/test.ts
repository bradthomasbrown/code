import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('UniversalRouter compile', async () => {
    const results = await compile({
        targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
        basePath: `${home}/universal-router/contracts`,
        includePaths: [`${home}/openzeppelin-contracts/v4.7.0-trim`, `${home}/solmate`, `${home}/permit2`, `${home}/v2-core`, `${home}/v3-core`],
        remappings: ['@openzeppelin=v4.7.0-trim', '@uniswap/='],
        optimizer: { enabled: true, runs: 1000000 },
        viaIR: true
    })
    console.log(results)
})