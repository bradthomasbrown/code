import { Json } from './json.ts';
import * as jra from './mod.ts'

function replacer(_key:unknown, value:unknown) {
    return typeof value == 'bigint'
        ? `0x${value.toString(16)}`
        : value
}

export class Server {
    
    static serve(options:Deno.ServeOptions, jraServeHandler:jra.types.ServeHandler) {
        async function denoServeHandler(
            request:Request,
            info:Deno.ServeHandlerInfo,
            jraServeHandler:jra.types.ServeHandler
        ) {
            const result = await Server.extract(request)
            if (result instanceof Response) return result
            else return jraServeHandler(result, request, info)
        }
        Deno.serve(options, (...x) => denoServeHandler(...x, jraServeHandler))
    }

    static async extract(request:Request):Promise<Response|jra.types.Request> {
        if (!request.body) return Server.error.PARSE_ERROR('no body')
        let buf = Uint8Array.from([])
        for await (const arr of request.body.values()) buf = Uint8Array.from([...buf, ...arr])
        const text = new TextDecoder().decode(buf)
        let json:unknown
        try { json = JSON.parse(text) } catch (_) { return Server.error.PARSE_ERROR('body not json') }
        return jra.schemas.request.parseAsync(json).catch(() => Server.error.INVALID_REQUEST())
    }

    static #error({ code, message, status, id, data }:{
        code:number
        message:string
        status:number
        id?:jra.types.Id
        data?:Json
    }) {
        const jsonrpc = '2.0'
        id ??= null
        const error = { code, message, data }
        const body:BodyInit = JSON.stringify({ jsonrpc, error, id })
        const headers = { 'Content-Type': 'application/json' }
        const init:ResponseInit = { status, headers }
        return new Response(body, init)
    }
    static error = Object.assign(Server.#error, {
        PARSE_ERROR: (data?:Json) => Server.#error({ code: -32700, message: 'Parse error.', status: 500, id: null, data }),
        INVALID_REQUEST: (data?:Json) => Server.#error({ code: -32600, message: 'Invalid Request.', status: 400, id: null, data }),
        METHOD_NOT_FOUND: (id:jra.types.Id, data?:Json) => Server.#error({ code: -32601, message: 'Method not found.', status: 404, id, data }),
        INVALID_PARAMS: (id:jra.types.Id, data?:Json) => Server.#error({ code: -32602, message: 'Invalid params.', status: 500, id, data }),
        INTERNAL_ERROR: (id:jra.types.Id, data?:Json) => Server.#error({ code: -32603, message: 'Internal error.', status: 500, id, data })
    })

    static respond({ result, id }:{
        result:unknown,
        id:jra.types.Id
    }) {
        const jsonrpc = '2.0'
        const body:BodyInit = JSON.stringify({ jsonrpc, result, id }, replacer)
        const headers = { 'Content-Type': 'application/json' }
        const status = 200
        const init:ResponseInit = { status, headers }
        return new Response(body, init)
    }

}

