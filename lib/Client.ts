import * as jra from './mod.ts'

export class Client {
    rpc:string
    constructor(rpc:string) {
        this.rpc = rpc
    }
    async request(method:string, params:jra.types.Params, id:jra.types.Id) {
        const foo = await fetch(this.rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
                id
            })
        })
        const json = await foo.json()
        const bar = jra.schemas.response.parse(json)
        if ('error' in bar) {
            const { code, message, data } = bar.error
            const error = new Error(`${code}: ${message}`)
            if (data) error.cause = data
            throw error
        }
        return bar.result
    }
}