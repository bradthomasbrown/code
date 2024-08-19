import { compile as solcCompile } from 'solc/compile/lib/mod.ts';

const home = Deno.env.get('HOME')!

export async function compile() {
    return await solcCompile({
        targets: { 'UniswapV3Factory.sol': ['UniswapV3Factory'], 'UniswapV3Pool.sol': ['UniswapV3Pool'] },
        basePath: `${home}/v3-core/contracts`,
        optimizer: { enabled: true, runs: 200 }
    })
}