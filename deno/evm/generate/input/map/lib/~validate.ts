import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts';

import {
    Source as OutputSource,
    Sources as OutputSources,
    Contract as OutputContract,
    Descriptor
} from 'solc/output/types/mod.ts';

import {
    Contracts as InputContracts,
    Descriptors,
    Input
} from 'generate/input/types/mod.ts'

export function validate(sources: OutputSources, input: Input) {

    function validateDescriptor(d: Descriptor, ds: Descriptors) {
        if (!d.type || d.type == 'function') assert(ds.fns.get(d.name)?.includes(d))
        else if (d.type == 'event') assert(ds.events.get(d.name)?.includes(d))
        else if (d.type == 'error') assert(ds.errors.get(d.name)?.includes(d))
        else if (d.type == 'constructor') assert(ds.ctor === d)
        else if (d.type == 'fallback') assert(ds.fallback === d)
        else if (d.type == 'receive') assert(ds.receive === d)
    }

    function validateContracts(name: string, outputContract: OutputContract, inputContracts: InputContracts) {
        const inputContract = inputContracts.get(name)
        assert(inputContract)
        assert(outputContract.evm?.bytecode?.object == inputContract?.bytecode)
        // test linkReferences
        for (const descriptor of outputContract.abi ?? []) validateDescriptor(descriptor, inputContract.descriptors)
    }

    function validateSource(name: string, source: OutputSource) {
        const inputContracts = input.get(name)
        assert(inputContracts)
        const outputContracts = source
        for (const entry of [...outputContracts.entries()]) validateContracts(...entry, inputContracts)
    }

    for (const entry of [...sources.entries()]) validateSource(...entry)

}