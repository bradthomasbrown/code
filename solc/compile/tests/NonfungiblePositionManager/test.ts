import { compile } from "solc/compile/tests/NonfungiblePositionManager/compile.ts"

Deno.test('compile', async () => { await compile() })