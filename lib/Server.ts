import * as jra from 'lib/mod.ts'

function replacer(_key:unknown, value:unknown) {
    return typeof value == 'bigint'
        ? `0x${value.toString(16)}`
        : value
}

export class Server {
    
    static serve(port:number=80, jraServeHandler:jra.types.ServeHandler) {
        async function denoServeHandler(
            request:Request,
            info:Deno.ServeHandlerInfo,
            jraServeHandler:jra.types.ServeHandler
        ) {
            const result = await Server.extract(request)
            if (result instanceof Response) return result
            else return jraServeHandler(result, request, info)
        }
        Deno.serve({ port }, (...x) => denoServeHandler(...x, jraServeHandler))
    }

    static async extract(request:Request):Promise<Response|jra.types.Request> {
        const getParseError = () => Server.error({ status: 500, code: -32700, message: 'Parse error.' })
        if (!request.body) return getParseError()
        let buf = Uint8Array.from([])
        for await (const arr of request.body.values()) buf = Uint8Array.from([...buf, ...arr])
        const text = new TextDecoder().decode(buf)
        let json:unknown
        try { json = JSON.parse(text) } catch (_) { return getParseError() }
        return jra.schemas.request.parseAsync(json).catch(() => getParseError())
    }

    static error({ code, message, status, id }:{
        code:number
        message:string
        status:number
        id?:jra.types.JraId
    }) {
        const jsonrpc = '2.0'
        id ??= null
        const error = { code, message }
        const body:BodyInit = JSON.stringify({ jsonrpc, error, id })
        const headers = { 'Content-Type': 'application/json' }
        const init:ResponseInit = { status, headers }
        return new Response(body, init)
    }

    static respond({ result, id }:{
        result:unknown,
        id:jra.types.JraId
    }) {
        const jsonrpc = '2.0'
        const body:BodyInit = JSON.stringify({ jsonrpc, result, id }, replacer)
        const headers = { 'Content-Type': 'application/json' }
        const status = 200
        const init:ResponseInit = { status, headers }
        return new Response(body, init)
    }

}

