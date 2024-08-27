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
        Deno.addSignalListener('SIGUSR1', this.execute)
        Deno.addSignalListener('SIGUSR2', this.execute)
        Deno.addSignalListener('SIGTERM', this.execute)
        ExitHandlers.#instance = this
    }

    execute() {
        if (this) this.#handlers.forEach(handler => handler())
        Deno.exit()
    }

    push(handler:()=>void) {
        if (this) this.#handlers.push(handler)
    }

}