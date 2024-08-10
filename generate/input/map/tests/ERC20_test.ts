import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts';
import { load } from 'solc/output/fixtures/lib/load.ts'
import { compile } from "../../../../solc/compile/tests/lib/ERC20_compile.ts"
import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { map } from 'generate/input/map/lib/mod.ts';
import { validate } from '../lib/~validate.ts';

const outputString = await load('ERC20', compile)
const output = outputSchema.parse(outputString)
const outputSources = output.contracts
assert(outputSources)
Deno.test('map and validate', () => {
    const input = map(output)
    validate(outputSources, input)
})