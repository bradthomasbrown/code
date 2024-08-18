import { compile } from "solc/compile/tests/lib/NFTDescriptor_compile.ts"

Deno.test('compile', async () => { await compile() })