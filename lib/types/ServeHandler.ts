import * as jra from '../mod.ts'

export type ServeHandler = (
    jraRequest:jra.types.Request,
    httpRequest:Request,
    info:Deno.ServeHandlerInfo
)=>Response|Promise<Response>