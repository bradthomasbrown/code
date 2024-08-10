import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { load } from "solc/compile/fixtures/lib/load.ts"
import { compile } from "solc/compile/tests/lib/UniversalRouter_compile.ts"

const outputString = await load('UniversalRouter', compile)

Deno.test('parse', () => { outputSchema.parse(outputString) })