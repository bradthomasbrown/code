import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts';
import { load } from "solc/compile/fixtures/lib/load.ts"
import { compile } from "solc/compile/tests/lib/WETH9_compile.ts"
import { output as outputSchema } from 'solc/output/schemas/mod.ts';
import { map } from 'generate/input/map/lib/mod.ts';
import { validate } from "generate/input/map/lib/~validate.ts";

const outputString = await load('WETH9', compile)
const output = outputSchema.parse(outputString)
const outputSources = output.contracts
assert(outputSources)
Deno.test('map and validate', () => {
    const input = map(output)
    validate(outputSources, input)
})