import {
    Output,
    Source as OutputSource,
    Contract as OutputContract,
    Descriptor
} from 'solc/output/types/mod.ts';
import {
    Input,
    Source as InputSource,
    Contract as InputContract,
    Descriptors
} from 'generate/input/types/mod.ts'

export function map(output:Output): Input {

    function mapMapValue<K, A, B>(map: Map<K, A>, mapper: (a: A) => B): Map<K, B> {
        return new Map([...map.entries()].map(([k, a]) => [k, mapper(a)]))
    }

    function populate(ds: Descriptors, d: Descriptor): void {
        const { fns, events, errors } = ds
        if (!d.type || d.type == 'function') fns.set(d.name, [...fns.get(d.name) ?? [], d])
        else if (d.type == 'event') events.set(d.name, [...events.get(d.name) ?? [], d])
        else if (d.type == 'error') errors.set(d.name, [...errors.get(d.name) ?? [], d])
        else if (d.type == 'constructor') ds.ctor = d
        else if (d.type == 'fallback') ds.fallback = d
        else if (d.type == 'receive') ds.receive = d
    }

    function mapContract(contract: OutputContract): InputContract {
        const bytecode = contract.evm?.bytecode?.object
        const linkReferences = contract.evm?.bytecode?.linkReferences
        const fns = new Map(), events = new Map(), errors = new Map()
        const descriptors = { fns, events, errors }
        for (const descriptor of contract.abi ?? []) populate(descriptors, descriptor)
        return { bytecode, linkReferences, descriptors }
    }

    function mapSource(source: OutputSource): InputSource { return mapMapValue(source, mapContract) }

    return mapMapValue(output.contracts ?? new Map(), mapSource)

}