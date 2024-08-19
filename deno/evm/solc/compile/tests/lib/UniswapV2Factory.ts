import { compile as solcCompile } from 'solc/compile/lib/mod.ts';

const home = Deno.env.get('HOME')!

export async function compile() {
    return await solcCompile({
        targets: { 'UniswapV2Factory.sol': ['UniswapV2Factory'], 'UniswapV2Pair.sol': ['UniswapV2Pair'] },
        basePath: `${home}/v2-core/contracts`
    })
}