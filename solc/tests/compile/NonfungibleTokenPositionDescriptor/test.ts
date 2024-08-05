import { compile } from '../../../lib/compile.ts';

const home = Deno.env.get('HOME')!

Deno.test('NonfungibleTokenPositionDescriptor compile', async () => {
    const results = await compile({
        targets: { 'NonfungibleTokenPositionDescriptor.sol': ['NonfungibleTokenPositionDescriptor'] },
        basePath: `${home}/v3-periphery/contracts`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`, `${home}/solidity-lib`],
        remappings: ['@uniswap/lib=solidity-lib', '@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    })
    console.log(results)
})