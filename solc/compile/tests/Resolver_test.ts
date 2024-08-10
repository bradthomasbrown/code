import { compile } from "solc/compile/tests/lib/Resolver_compile.ts"

Deno.test('compile', async () => { await compile() })