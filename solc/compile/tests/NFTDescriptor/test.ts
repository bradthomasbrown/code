import { compile } from "solc/compile/tests/NFTDescriptor/compile.ts"

Deno.test('compile', async () => { await compile() })