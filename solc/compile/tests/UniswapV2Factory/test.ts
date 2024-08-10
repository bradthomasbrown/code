import { compile } from "solc/compile/tests/UniswapV2Factory/compile.ts"

Deno.test('compile', async () => { await compile() })