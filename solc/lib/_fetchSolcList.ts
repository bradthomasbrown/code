import { SolcListObject } from "../types/_SolcListObject.ts";
import { solcListObject } from "../schemas/_solcListObject.ts"

export async function fetchSolcList():Promise<SolcListObject> {
    const cachePath = `${Deno.env.get('HOME')}/.kaaos/solc/list.json`
    const fileInfo = await Deno.stat(cachePath).catch(() => undefined)
    const unmodifiedAge = fileInfo?.mtime ? Date.now() - fileInfo.mtime.getTime() : Infinity
    if (!fileInfo || unmodifiedAge >= 1000 * 3600 * 60 * 24) {
        const response = await fetch('https://binaries.soliditylang.org/linux-amd64/list.json')
        const blob = await response.blob()
        await Deno.writeFile(cachePath, blob.stream(), { mode: 0o755 })
    }
    const solcListText = await Deno.readTextFile(cachePath)
    return solcListObject.parse(JSON.parse(solcListText))
}