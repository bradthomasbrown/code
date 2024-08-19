import { compile } from "solc/compile/tests/lib/NonfungibleTokenPositionDescriptor_compile.ts"

Deno.test('compile', async () => { await compile() })