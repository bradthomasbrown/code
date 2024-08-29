type Ref = { library: string, placeholder: string }
export type Refs = Ref[]

type ByIndex = string[]
type ByName = [Record<string, string>]


export function link(bytecode: string, refs: Refs, parameters: ByIndex | ByName ): string
{

    for (const [i, { library, placeholder }] of refs.entries())
    {
        const address = typeof parameters[0] == 'string'
            ? (<ByIndex>parameters)[i]
            : (<ByName>parameters)[0][library]
        bytecode = bytecode.replaceAll(placeholder, address.slice(2).toLowerCase())
    }

    return bytecode

}