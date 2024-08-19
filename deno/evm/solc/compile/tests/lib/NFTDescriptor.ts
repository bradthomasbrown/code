import { compile as solcCompile } from 'solc/compile/lib/mod.ts';

const home = Deno.env.get('HOME')!

export async function compile() {
    return await solcCompile({
        targets: { 'NFTDescriptor.sol': ['NFTDescriptor'] },
        basePath: `${home}/v3-periphery/contracts/libraries`,
        includePaths: [`${home}/v3-core`, `${home}/openzeppelin-contracts/v3.4.2-solc-0.7-trim`, `${home}/base64`],
        remappings: ['@uniswap/=', '@openzeppelin=v3.4.2-solc-0.7-trim', 'base64-sol=base64'],
        optimizer: { enabled: true, runs: 200 }
    })
}