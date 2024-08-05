export class Cache {

    root: string

    constructor(root:string) { this.root = root }

    async ensure({ path, expire=Infinity, retrieve }:{
        path: string
        expire?: number
        retrieve: () => Promise<void>
    }) {
        await this.#ensureCacheDirExists()
        const fileInfo = await Deno.stat(`${this.root}/${path}`).catch(() => undefined)
        const unmodifiedAge = Date.now() - (fileInfo?.mtime?.getTime() ?? -Infinity)
        if (!fileInfo || unmodifiedAge >= expire) await retrieve()
    }

    async readTextFile({ path, expire=Infinity, retrieve }:{
        path: string
        expire?: number
        retrieve: () => Promise<void>
    }) {
        await this.ensure({ path, expire, retrieve })
        return await Deno.readTextFile(`${this.root}/${path}`)
    }

    async writeFile(path: string, data: Uint8Array | ReadableStream<Uint8Array>) {
        await this.#ensureCacheDirExists()
        return await Deno.writeFile(`${this.root}/${path}`, data)
    } 

    async #ensureCacheDirExists() {
        const fileInfo = await Deno.stat(this.root).catch(() => undefined)
        if (!fileInfo) await Deno.mkdir(this.root, { recursive: true })
    }

}