import { SolcListObject } from "../types/_SolcListObject.ts";
import { solcListObject } from "../schemas/_solcListObject.ts"

export async function fetchSolcList():Promise<SolcListObject> {
    const response = await fetch('https://binaries.soliditylang.org/linux-amd64/list.json')
    const text = await response.text()
    return solcListObject.parse(JSON.parse(text))
}