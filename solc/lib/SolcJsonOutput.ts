import { Abi } from '../../abi/lib/Abi.ts'
import { SolcJsonOutputObject } from "../types/_SolcJsonOutputObject.ts";

export class SolcJsonOutput {

    #solcJsonOutputObject:SolcJsonOutputObject

    constructor(solcJsonOutputObject:SolcJsonOutputObject) {
        this.#solcJsonOutputObject = solcJsonOutputObject
    }

    bytecode(contract:string):string {
        const sources = Object.values(this.#solcJsonOutputObject.contracts).filter(source => Object.keys(source).includes(contract))
        if (!sources.length) throw new Error(`contract name '${contract}' not found`)
        if (sources.length > 1) throw new Error(`multiple contracts named '${contract} found`)
        const bytecode = sources[0][contract].evm?.bytecode?.object
        if (!bytecode) throw new Error(`no bytecode for contract '${contract}'`)
        return bytecode
    }

    abi(contract:string):Abi {
        const sources = Object.values(this.#solcJsonOutputObject.contracts).filter(source => Object.keys(source).includes(contract))
        if (!sources.length) throw new Error(`contract name '${contract}' not found`)
        if (sources.length > 1) throw new Error(`multiple contracts named '${contract} found`)
        const abiObject = sources[0][contract].abi
        if (!abiObject) throw new Error(`no abi for contract '${contract}'`)
        return new Abi(abiObject)
    }

}