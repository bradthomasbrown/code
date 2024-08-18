import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { solcJsonOutput as solcJsonOutputSchema } from '../../../../solc/schemas/_DEPRECATE_solcJsonOutput.ts';
import { generate } from '../../../lib/generate.ts';

Deno.test('NFTDescriptor generate', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('./results.txt')))
    const solcJsonOutput = solcJsonOutputSchema.parse(results)
    await generate(solcJsonOutput, fromFileUrl(import.meta.resolve('./build')))
})