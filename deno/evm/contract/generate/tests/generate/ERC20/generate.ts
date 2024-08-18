import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { solcJsonOutput } from '../../../../solc/schemas/_DEPRECATE_solcJsonOutput.ts';

Deno.test('ERC20 generate', async () => {
    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('./results.txt')))
    solcJsonOutput.parse(results)
})