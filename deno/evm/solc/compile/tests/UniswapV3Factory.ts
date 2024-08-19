import { compile } from "solc/compile/tests/lib/UniswapV3Factory_compile.ts"

Deno.test('compile', async () => { await compile() })