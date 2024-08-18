import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { load } from "solc/compile/fixtures/lib/load.ts"
import { compile } from "solc/compile/tests/lib/NFTDescriptor_compile.ts"

const outputString = await load('NFTDescriptor', compile)

Deno.test('parse', () => { outputSchema.parse(outputString) })