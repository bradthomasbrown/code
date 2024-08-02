import { AbiObject } from "../types/_AbiObject.ts"
import { SignatureComponents } from "../types/_SignatureComponents.ts";

function normalize(type:string):string {
    const brackets = type.match(/\[\]/) ? '[]' : ''
    const structMatch = type.match(/struct ([\w\.]+)/)
    if (structMatch) return structMatch[1] + brackets
    if (type.match(/u?int\d/)) return 'bigint' + brackets
    if (type.match(/address/)) return 'string' + brackets
    if (type.match(/bytes/)) return 'string' + brackets
    throw new Error(`cannot normalize unhandled type ${type}`)
}

export class Abi {

    #abiObject:AbiObject

    constructor(abiObject:AbiObject) {
        this.#abiObject = abiObject
        for (const abiElementObject of abiObject)
            if (abiElementObject.type == 'constructor') abiElementObject.name = 'construct'
        const constructors = abiObject.filter(({ name }) => name == 'construct')
        if (!constructors.length) abiObject.push({ type: 'constructor', name: 'construct', inputs: [] })
        if (constructors.length > 1) throw new Error('too many constructors')
    }

    signatureComponentsMap():Map<string,SignatureComponents[]> {
        const map = new Map<string,SignatureComponents[]>()
        for (const { name, inputs } of this.#abiObject) {
            if (!name || !inputs) continue
            if (!map.has(name)) map.set(name, [])
            const signatureComponentsArray = map.get(name)!
            if (!inputs.length) { signatureComponentsArray.push({ type: 'nullary' }); continue }
            const parameters = inputs.map(({ name, internalType }) => name ? `${name}:${normalize(internalType)}` : normalize(internalType)).join()
            signatureComponentsArray.push({ parameters, type: 'index' })
            if (inputs.every(({ name }) => name)) {
                const variables = inputs.map(({ name }) => name).join()
                const types = inputs.map(({ name, internalType }) => `${name}:${normalize(internalType)}`).join()
                const parameters = `{${variables}}:{${types}}`
                signatureComponentsArray.push({ parameters, types, type: 'name' })
            }
        }
        return map
    }

    toString() { return JSON.stringify(this.#abiObject) }

}