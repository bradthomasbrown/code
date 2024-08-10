import { compile } from "solc/compile/tests/NonfungibleTokenPositionDescriptor/compile.ts"

Deno.test('compile', async () => { await compile() })