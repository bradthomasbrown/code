import { AbiObject } from "../types/_AbiObject.ts"
import { SignatureComponents } from "../types/_SignatureComponents.ts";

function normalize(type:string):string {
    const brackets = type.match(/\[\]/) ? '[]' : ''
    const structMatch = type.match(/struct ([\w\.]+)/)
    if (structMatch) return structMatch[1] + brackets
    if (type.match(/u?int\d/)) return 'bigint' + brackets
    if (type.match(/address/)) return 'string' + brackets
    if (type.match(/bytes\d/)) return 'string' + brackets
    throw new Error(`cannot normalize unhandled type ${type}`)
}

export class Abi {

    #abiObject:AbiObject

    constructor(abiObject:AbiObject) {
        this.#abiObject = abiObject
    }

    signatureComponentsMap():Map<string,SignatureComponents[]> {
        const map = new Map<string,SignatureComponents[]>()
        for (const abiElementObject of this.#abiObject) {
            let name = abiElementObject.name
            const inputs = abiElementObject.inputs
            if (!name || !inputs) continue
            if (name == 'constructor') name = 'construct'
            if (!map.has(name)) map.set(name, [])
            const signatureComponentsArray = map.get(name)!
            if (!inputs.length) { signatureComponentsArray.push({ type: 'nullary' }); continue }
            const parameters = inputs.map(({ name, type }) => name ? `${name}:${normalize(type)}` : normalize(type)).join()
            signatureComponentsArray.push({ parameters, type: 'index' })
            if (inputs.every(({ name }) => name)) {
                const variables = inputs.map(({ name }) => name).join()
                const types = inputs.map(({ name, type }) => `${name}:${normalize(type)}`).join()
                const parameters = `{${variables}}:{${types}}`
                signatureComponentsArray.push({ parameters, types, type: 'name' })
            }
        }
        return map
    }

    toString() { return JSON.stringify(this.#abiObject) }

}