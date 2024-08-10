import { compile } from "solc/compile/tests/lib/UniversalRouter_compile.ts"

Deno.test('compile', async () => { await compile() })