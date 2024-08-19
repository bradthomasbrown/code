import { compile } from "solc/compile/tests/lib/WETH9_compile.ts"

Deno.test('compile', async () => { await compile() })