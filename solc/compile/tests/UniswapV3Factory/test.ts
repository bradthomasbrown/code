import { compile } from "solc/compile/tests/UniswapV3Factory/compile.ts"

Deno.test('compile', async () => { await compile() })