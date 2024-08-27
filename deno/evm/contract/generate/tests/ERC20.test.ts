import { Cache } from '../../../../stdplus/cache/lib/mod.ts'
import { compile } from '../../../solc/compile/lib/mod.ts'
import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts'
import { output as outputSchema } from '../../../solc/output/schemas/mod.ts'
import { generate } from '../lib/mod.ts';
import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { Source } from "../../../solc/output/types/Source.ts";
import { Contract } from "../../../solc/output/types/Contract.ts";

type Context = Map<string, string>

const edgeCase = 'ERC20'
const cache = new Cache(fromFileUrl(import.meta.resolve(`../../../solc/compile/fixtures`)))
const path = `${edgeCase}.json`
const retrieve = async () => {
    const { params } = await import(`../../../solc/compile/tests/params.ts`)
    const results = await compile(params[edgeCase])
    await cache.writeTextFile(path, results)
}
const outputString = await cache.readTextFile({ path, retrieve })
const output = outputSchema.parse(outputString)
const { contracts: sources } = output
if (!sources) throw new Error('sources not found')

Deno.test('generate and validate', async (t) => {

    const root = fromFileUrl(import.meta.resolve('./build'))
    const context = new Map([['root', root]])

    if (!await t.step('generate', async () => {
        await generate(root, sources)
    })) throw new Error('generate failed')

    await t.step('validate', async (t) => {
        const path = context.get('root')
        assert(path, 'root path not set')
        await t.step('root dir exists', async () => await rootDirExists(context))
        for (const [sourceName, source] of sources)
            await sourceCreated(t, context.set('source', `${path}/${sourceName}`), source)
    })

})

async function rootDirExists(context: Context): Promise<void> {
    const path = context.get('root')
    assert(path, 'root path not set')
    assert(await exists(path), 'root dir not found')
}



async function sourceCreated(t: Deno.TestContext, context: Context, source: Source): Promise<void> {
    const path = context.get('source')
    assert(path, 'source path not set')
    await t.step('source dir exists', async () => await sourceDirExists(context))
    const contracts = source
    for (const [contractName, contract] of contracts)
        await contractCreated(t, context.set('contract', `${path}/${contractName}`), contract)
}

async function sourceDirExists(context: Context): Promise<void> {
    const path = context.get('source')
    assert(path, 'source path not set')
    assert(await exists(path), 'source dir not found')
}



async function contractCreated(t: Deno.TestContext, context: Context, contract: Contract): Promise<void> {
    const path = context.get('contract')
    await t.step('contract dir exists', async () => await contractDirExists(context))
    const bytecode = contract?.evm?.bytecode?.object
    if (bytecode) {
        const linkReferences = contract?.evm?.bytecode?.linkReferences
        if (linkReferences) {
            await t.step('link file exists', async () => await linkFileExists(context))
            await t.step('refs file exists', async () => await refsFileExists(context))
        }
        await t.step('bytecode string file exists', async () => await bytecodeStringFileExists(context))
        await t.step('bytecode function file exists', async () => await bytecodeFunctionFileExists(context))
        await t.step('link functionality', async () => await linkFunctionality(context))
    }
}

async function contractDirExists(context: Context): Promise<void> {
    const path = context.get('contract')
    assert(path, 'contract path not set')
    assert(await exists(path), 'contract dir not found')
}

async function linkFileExists(context: Context): Promise<void> {
    const path = context.get('source')
    assert(path, 'source path not set')
    assert(await exists(`${path}/_link.ts`), 'link file not found')
}

async function refsFileExists(context: Context): Promise<void> {
    const path = context.get('contract')
    assert(path, 'contract path not set')
    assert(await exists(`${path}/_refs.ts`), 'refs file not found')
}