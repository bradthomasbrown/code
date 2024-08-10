import { Cache } from 'std/cache/Cache.ts'

const defaultCache = new Cache(`${Deno.env.get('HOME')!}/.kaaos/solc`)

export class Release {

    static async ensure(release:string, cache=defaultCache) {
        const path = release
        const retrieve = () => fetch(`https://binaries.soliditylang.org/linux-amd64/${release}`)
            .then(response => response.blob())
            .then(blob => cache.writeFile(path, blob.stream()))
        await cache.ensure({ path, retrieve })
    }

}