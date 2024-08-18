import { Server } from "../../../lib/mod.ts";
import { ServeHandler } from "../../../lib/types/ServeHandler.ts";

const handler:ServeHandler = (jraRequest, _request, _info) => {
    const result = { foo: 'bar' }
    const { id } = jraRequest
    return Server.respond({ result, id })
}

Server.serve(80, handler)