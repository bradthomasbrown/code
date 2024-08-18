export class ExitHandlers {

    #handlers!:(()=>void)[]
    static #instance:ExitHandlers

    constructor() {
        if (ExitHandlers.#instance) return ExitHandlers.#instance
        this.#handlers = []
        globalThis.addEventListener('beforeunload', (_e:Event) => this.execute())
        globalThis.addEventListener('unload', (_e:Event) => this.execute())
        globalThis.addEventListener('unhandledrejection', (e:Event) => {
            if (e instanceof PromiseRejectionEvent) console.error(e.reason)
            this.execute()
        })
        Deno.addSignalListener('SIGINT', this.execute)
        Deno.addSignalListener('SIGTERM', this.execute)
        ExitHandlers.#instance = this
    }

    execute() {
        this.#handlers.forEach(handler => handler())
        Deno.exit()
    }

    push(handler:()=>void) {
        this.#handlers.push(handler)
    }

}