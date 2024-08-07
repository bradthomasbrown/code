import { Cache } from '../../../std/cache/Cache.ts'
import * as SV from '../../../std/semver/mod.ts'
import { solcList as solcListSchema } from '../schemas/_solcListObject.ts'
import { solidityToSvRange } from './_solidityToSvRange.ts'
import { SolcListObject } from '../types/_SolcListObject.ts';

const defaultCache = new Cache(`${Deno.env.get('HOME')!}/.kaaos/solc`)

export interface SolcList extends SolcListObject {}
export class SolcList {

    constructor(solcListObject:SolcListObject) { Object.assign(this, solcListObject) }

    versions():SV.SemVer[] { return Object.keys(this.releases).map(SV.parse) }

    maxSatisfying(code:string): [version:string, release:string]
    maxSatisfying(codeArray:string[]): [version:string, release:string]
    maxSatisfying(param0:string|string[]): [version:string, release:string] {
        const codeArray = typeof param0 == 'string' ? [param0] : param0
        const ranges:SV.Range[] = codeArray.map(solidityToSvRange)
        const versions:SV.SemVer[] = this.versions()
        const semver = SV.maxSatisfying(versions, ranges)
        if (!semver) throw new Error('no version satisfies code')
        const version = SV.format(semver)
        return [version, this.releases[version]!]
    }

    static async get(cache=defaultCache) {
        const path = 'list.json'
        const retrieve = () => fetch('https://binaries.soliditylang.org/linux-amd64/list.json')
            .then(response => response.blob())
            .then(blob => cache.writeFile(path, blob.stream()))
        const expire = 86400e3
        const solcListText = await cache.readTextFile({ path, expire, retrieve })
        return new SolcList(solcListSchema.parse(solcListText))
    }

}