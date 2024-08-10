import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { load } from 'solc/output/fixtures/lib/load.ts'
import { compile } from "solc/compile/tests/NFTDescriptor/compile.ts"

const outputString = await load('NFTDescriptor', compile)

Deno.test('parse', () => { outputSchema.parse(outputString) })