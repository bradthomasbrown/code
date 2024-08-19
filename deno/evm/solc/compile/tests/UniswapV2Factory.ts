import { compile } from "solc/compile/tests/lib/UniswapV2Factory_compile.ts"

Deno.test('compile', async () => { await compile() })