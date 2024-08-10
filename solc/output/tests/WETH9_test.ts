import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { load } from "solc/compile/fixtures/lib/load.ts"
import { compile } from "solc/compile/tests/lib/WETH9_compile.ts"

const outputString = await load('WETH9', compile)

Deno.test('parse', () => { outputSchema.parse(outputString) })