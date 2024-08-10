import { compile as solcCompile } from 'solc/compile/lib/mod.ts';

const home = Deno.env.get('HOME')!

export async function compile() {
    return await solcCompile({
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: `${home}/dizzyhavoc/contracts/Resolver`
    })
}