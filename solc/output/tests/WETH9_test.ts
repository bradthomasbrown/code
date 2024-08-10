import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { load } from 'solc/output/fixtures/lib/load.ts'
import { compile } from 'solc/compile/tests/WETH9/compile.ts'

const outputString = await load('WETH9', compile)

Deno.test('parse', () => { outputSchema.parse(outputString) })