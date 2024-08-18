import { compile as solcCompile } from 'solc/compile/lib/mod.ts';

const home = Deno.env.get('HOME')!

export async function compile() {
    return await solcCompile({
        targets: { 'weth9.sol': ['WETH9'] },
        basePath: `${home}/ds-weth/src`
    })
}