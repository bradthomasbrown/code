import { compile } from "solc/compile/tests/lib/ERC20_compile.ts"

Deno.test('compile', async () => { await compile() })