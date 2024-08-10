import { compile } from "solc/compile/tests/ERC20/compile.ts"

Deno.test('compile', async () => { await compile() })