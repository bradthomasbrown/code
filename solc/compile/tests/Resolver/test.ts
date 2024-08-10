import { compile } from "solc/compile/tests/Resolver/compile.ts"

Deno.test('compile', async () => { await compile() })