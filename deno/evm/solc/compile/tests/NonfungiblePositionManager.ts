import { compile } from "solc/compile/tests/lib/NonfungiblePositionManager_compile.ts"

Deno.test('compile', async () => { await compile() })