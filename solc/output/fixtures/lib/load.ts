import { cache } from 'solc/output/fixtures/lib/cache.ts'

export async function load(name:string, compile:()=>Promise<string>) {
    const path = `${name}.json`
    async function retrieve() {
        const output = await compile()
        await cache.writeTextFile(path, output)
    }
    return await cache.readTextFile({ path, retrieve })
}