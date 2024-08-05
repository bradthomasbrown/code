import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('NonfungiblePositionManager compile', async () => {
    const results = await compile({
        targets: { 'NonfungiblePositionManager.sol': ['NonfungiblePositionManager'] },
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim'],
        optimizer: { enabled: true, runs: 200 }
    })
    console.log(results)
})