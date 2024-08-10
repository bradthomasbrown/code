import { compile } from "solc/compile/tests/WETH9/compile.ts"

Deno.test('compile', async () => { await compile() })