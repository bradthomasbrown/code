import * as SV from 'https://deno.land/std@0.224.0/semver/mod.ts'
import * as Path from 'https://deno.land/std@0.224.0/path/mod.ts'
import { SolcJsonInputObject } from "../types/_SolcJsonInputObject.ts"
import { solcJsonInputObject as solcJsonInputObjectSchema } from "../schemas/_solcJsonInputObject.ts"
import { fetchSolcList } from './_fetchSolcList.ts'
import { solidityToSvRange } from './_solidityToSvRange.ts';

export interface SolcJsonInput extends SolcJsonInputObject {}
export class SolcJsonInput {

    constructor(solcJsonInputObject:SolcJsonInputObject) {
        Object.assign(this, solcJsonInputObject)
    }

    static async fromPath(path:string):Promise<SolcJsonInput> {
        const text = await Deno.readTextFile(path)
        return new SolcJsonInput(solcJsonInputObjectSchema.parse(JSON.parse(text)))
    }

    sourcePaths():string[] {
        const sourcePaths = []
        for (const source in this.sources) sourcePaths.push(...this.sources[source].urls)
        return sourcePaths
    }

    async bestRelease({ basePath, includePaths }:{ basePath?:string, includePaths?:string[] }={}):Promise<string> {
        const solcList = await fetchSolcList()
        const sourceTexts = await Promise.all(this.sourcePaths().map(async path => {
            if (await Deno.stat(path).catch(()=>0)) return Deno.readTextFile(path)
            if (basePath && await Deno.stat(`${basePath}/${path}`).catch(()=>0)) return Deno.readTextFile(`${basePath}/${path}`)
            if (includePaths?.length)
                for (const includePath of includePaths)
                    if (await Deno.stat(`${includePath}/${path}`).catch(()=>0)) return Deno.readTextFile(`${includePath}/${path}`)
            throw new Error(`path not found abs, in base, or in any include: '${path}'`)
        }))
        const ranges:SV.Range[] = sourceTexts.map(solidityToSvRange)
        let versions:SV.SemVer[] = Object.keys(solcList.releases).map(SV.parse)
        for (const range of ranges) versions = versions.filter(v => SV.satisfies(v, range))
        if (!versions.length) throw new Error('no solc version satisfies all sources')
        const version = SV.format(versions.reduce((p, c) => SV.greaterThan(c, p) ? c : p))
        return solcList.releases[version]
    }

    toString() { return JSON.stringify(this) }

}