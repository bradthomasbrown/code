import { extract } from "./extract.ts";
import { ServeHandler } from "./types/ServeHandler.ts";

export function serve(jraServeHandler:ServeHandler) {
    return Deno.serve(denoServeHandler.bind({ jraServeHandler }))
}

async function denoServeHandler(this:{ jraServeHandler:ServeHandler }, request:Request) {
    const result = await extract(request)
    if (result instanceof Response) return result
    else return this.jraServeHandler(request)
} 