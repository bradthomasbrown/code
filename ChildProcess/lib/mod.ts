export class ChildProcess implements Deno.ChildProcess {

    pid: number
    status: Promise<Deno.CommandStatus>
    stderr: ReadableStream<Uint8Array>
    stdin: WritableStream<Uint8Array>
    stdout: ReadableStream<Uint8Array>
    [Symbol.asyncDispose]!: () => Promise<void>
    kill: (signo?: Deno.Signal) => void
    #output: () => Promise<Deno.CommandOutput>
    ref: () => void
    unref: () => void

    constructor(proc:Deno.ChildProcess) {
        this.pid = proc.pid
        this.status = proc.status
        this.stderr = proc.stderr
        this.stdin = proc.stdin
        this.stdout = proc.stdout
        this[Symbol.asyncDispose] = proc[Symbol.asyncDispose].bind(proc)
        this.kill = proc.kill.bind(proc)
        this.#output = proc.output.bind(proc)
        this.ref = proc.ref.bind(proc)
        this.unref = proc.unref.bind(proc)
    }

    async writeAndClose(data:Uint8Array) {
        const writer = this.stdin.getWriter()
        await writer.write(data)
        await writer.close()
    }

    async output() {
        const commandOutput = await this.#output()
        const decoder = new TextDecoder()
        return {
            stdoutText: decoder.decode(commandOutput.stdout),
            stderrText: decoder.decode(commandOutput.stderr),
            ...commandOutput
        }
    }

}