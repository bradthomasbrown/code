import * as lib from './mod.ts'

export const extract = async (request:Request):Promise<Response|lib.types.RequestO> => {
    const getParseError = () => lib.error({ status: 500, code: -32700, message: 'Parse error.' })
    if (!request.body) return getParseError()
    let buf = Uint8Array.from([])
    for await (const arr of request.body.values()) buf = Uint8Array.from([...buf, ...arr])
    const text = new TextDecoder().decode(buf)
    let json:unknown
    try { json = JSON.parse(text) } catch (_) { return getParseError() }
    return lib.schema.requestO.parseAsync(json)
        .catch(() => getParseError())
}