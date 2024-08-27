import { descriptor } from "./descriptor/mod.ts"
import { Descriptor } from '../../../types/mod.ts'

export const abi = descriptor.array().transform(descriptorArray => {
    const abi = new Map<string, Descriptor[]>()
    for (const descriptor of descriptorArray) {
        const name = 'name' in descriptor ? descriptor.name : descriptor.type
        if (abi.has(name)) {
            abi.get(name)!.push(descriptor)
        } else {
            abi.set(name, [descriptor])
        }
    }
    return abi
})