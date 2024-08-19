import { Cache } from '../../../../stdplus/Cache/lib/mod.ts'
import * as SV from '../../../../stdplus/semver/lib/mod.ts'
import { solidityToSvRange } from "./solidityToSvRange.ts"
import { List as ListObject } from "../types/List.ts"
import { list as listSchema } from "../schemas/mod.ts"

export interface List extends ListObject {}
export class List {

    constructor(listObject:ListObject) { Object.assign(this, listObject) }

    versions():SV.SemVer[] { return [...this.releases.keys()].map(SV.parse) }

    maxSatisfying(code:string): [version:string, release:string]
    maxSatisfying(codeArray:string[]): [version:string, release:string]
    maxSatisfying(param0:string|string[]): [version:string, release:string] {
        const codeArray = typeof param0 == 'string' ? [param0] : param0
        const ranges:SV.Range[] = codeArray.map(solidityToSvRange)
        const versions:SV.SemVer[] = this.versions()
        const semver = SV.maxSatisfying(versions, ranges)
        if (!semver) throw new Error('no version satisfies code')
        const version = SV.format(semver)
        return [version, this.releases.get(version)!]
    }

    static async get(cache=defaultCache) {
        const path = 'list.json'
        const retrieve = () => fetch('https://binaries.soliditylang.org/linux-amd64/list.json')
            .then(response => response.blob())
            .then(blob => cache.writeFile(path, blob.stream()))
        const expire = 86400e3
        const listString = await cache.readTextFile({ path, expire, retrieve })
        return new List(listSchema.parse(listString))
    }

}