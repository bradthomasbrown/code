import * as jra from 'lib/mod.ts'

export type ServeHandler = (
    jraRequest:jra.types.Request,
    httpRequest:Request,
    info:Deno.ServeHandlerInfo
)=>Response|Promise<Response>