import { compile } from "solc/compile/tests/UniversalRouter/compile.ts"

Deno.test('compile', async () => { await compile() })