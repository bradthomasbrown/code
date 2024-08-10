import { compile as solcCompile } from 'solc/compile/lib/mod.ts';

const home = Deno.env.get('HOME')!

export async function compile() {
    return await solcCompile({
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: `${home}/dizzyhavoc/contracts/ERC20`
    })
}