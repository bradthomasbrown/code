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

    static async fromPath(path:string, targetDir?:string):Promise<SolcJsonInput> {
        const text = await Deno.readTextFile(path)
        const solcJsonInputObject = solcJsonInputObjectSchema.parse(JSON.parse(text))
        for (const source of Object.values(solcJsonInputObject.sources)) source.urls = source.urls.map(url => Path.resolve(targetDir ?? Path.dirname(path), url))
        return new SolcJsonInput(solcJsonInputObject)
    }

    sourcePaths():string[] {
        const sourcePaths = []
        for (const source in this.sources) sourcePaths.push(...this.sources[source].urls)
        return sourcePaths
    }

    async bestRelease():Promise<string> {
        const solcList = await fetchSolcList()
        const sourceTexts = await Promise.all(this.sourcePaths().map(path => Deno.readTextFile(path)))
        const ranges:SV.Range[] = sourceTexts.map(solidityToSvRange)
        let versions:SV.SemVer[] = Object.keys(solcList.releases).map(SV.parse)
        for (const range of ranges) versions = versions.filter(v => SV.satisfies(v, range))
        if (!versions.length) throw new Error('no solc version satisfies all sources')
        const version = SV.format(versions.reduce((p, c) => SV.greaterThan(c, p) ? c : p))
        return solcList.releases[version]
    }

    toString() { return JSON.stringify(this) }

}