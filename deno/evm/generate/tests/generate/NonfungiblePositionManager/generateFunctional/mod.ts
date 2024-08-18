import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';
import { solcJsonOutput as solcJsonOutputSchema } from '../../../../solc/schemas/solcJsonOutput.ts';
import { generate } from '../../../lib/generate.ts';
import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts';
import { SolcJsonOutputSource } from '../../../../solc/types/_SolcJsonOutputSource.ts'
import { SolcJsonOutputContract } from '../../../../solc/types/_SolcJsonOutputContract.ts'
import { Descriptor } from '../../../../solc/types/_Descriptor.ts';
import { FunctionDescriptor } from '../../../../solc/types/_FunctionDescriptor.ts';
import { ErrorDescriptor } from '../../../../solc/types/_ErrorDescriptor.ts';
import { EventDescriptor } from '../../../../solc/types/_EventDescriptor.ts';
import { FallbackDescriptor } from '../../../../solc/types/_FallbackDescriptor.ts';
import { ReceiveDescriptor } from '../../../../solc/types/_ReceiveDescriptor.ts';
import { ConstructorDescriptor } from '../../../../solc/types/_ConstructorDescriptor.ts';

async function testReceive(_testContext: Deno.TestContext, _descriptor: ReceiveDescriptor, _root: string) {
    
}

async function testFallback(_testContext: Deno.TestContext, _descriptor: FallbackDescriptor, _root: string) {
    
}

async function testEvent(_testContext: Deno.TestContext, _descriptor: EventDescriptor, _root: string) {
    
}

async function testError(_testContext: Deno.TestContext, _descriptor: ErrorDescriptor, _root: string) {
    
}

async function testConstructor(_testContext: Deno.TestContext, _descriptor: ConstructorDescriptor, _root: string) {

}

async function testFunction(testContext: Deno.TestContext, descriptor: FunctionDescriptor, root: string) {

    const dir = `${root}/encode.ts`

    await testContext.step(`encode ${descriptor.name}`, async (testContext) => {

        await testContext.step('encode.ts exists', async () => { await Deno.stat() })

        const { encode } = await import(`${root}/encode.ts`) as { encode: (...args:unknown[]) => string }
        assert(typeof encode == 'function')
        const encoding = encode()
        console.log(encoding)
        assert(encoding.match(/0x([0-9a-f]){8}([0-9a-f]{64}){0,}/))
    })

}

const descriptorDirsTested = new Set<string>()
async function testDescriptor(testContext: Deno.TestContext, descriptor: Descriptor, root: string) {
    const name = ('name' in descriptor ? descriptor.name : descriptor.type).replace('constructor', 'construct')
    const dir = `${root}/${name}`
    if (!descriptorDirsTested.has(dir)) {
        await testContext.step(`descriptor dir ${name}`, async () => { await Deno.stat(dir) })
        descriptorDirsTested.add(dir)
    }
    if (!descriptor.type || descriptor.type == 'function') await testFunction(testContext, descriptor, dir)
    else if (descriptor.type == 'constructor')  await testConstructor(testContext, descriptor, dir)
    else if (descriptor.type == 'error') await testError(testContext, descriptor, dir)
    else if (descriptor.type == 'event') await testEvent(testContext, descriptor, dir)
    else if (descriptor.type == 'fallback') await testFallback(testContext, descriptor, dir)
    else if (descriptor.type == 'receive') await testReceive(testContext, descriptor, dir)
}

async function testContract(testContext: Deno.TestContext, name: string, contract: SolcJsonOutputContract, root: string) {
    const dir = `${root}/${name.replace(/^I?/, 'I')}`
    await testContext.step(`contract ${name}`, async () => { await Deno.stat(dir) })
    const descriptors = contract.abi
    const bytecode = contract.evm?.bytecode?.object
    if (descriptors) for (const descriptor of descriptors) await testDescriptor(testContext, descriptor, dir)
    if (bytecode) await testContext.step('bytecode', async () => {
        const { bytecode } = await import(`${dir}/bytecode.ts`) as { bytecode: string }
        assert(typeof bytecode == 'string')
    })
}

async function testSource(testContext: Deno.TestContext, name: string, source: SolcJsonOutputSource, root: string) {
    const dir = `${root}/${name.replace(/^I?/, 'I')}`
    await testContext.step(`source ${name}`, async () => { await Deno.stat(dir) })
    for (const [name, contract] of [...source.entries()]) await testContract(testContext, name, contract, dir)
}

Deno.test('generate', async (testContext) => {

    const results = await Deno.readTextFile(fromFileUrl(import.meta.resolve('./results.txt')))
    const solcJsonOutput = solcJsonOutputSchema.parse(results)
    const dir = fromFileUrl(import.meta.resolve('./build'))

    if (!await testContext.step('generate', async () => { await generate(solcJsonOutput, dir) })) return

    const sources = solcJsonOutput.contracts
    assert(sources)

    for (const [name, source] of [...sources.entries()]) await testSource(testContext, name, source, dir)

})