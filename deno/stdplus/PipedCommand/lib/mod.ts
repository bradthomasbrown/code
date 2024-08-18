import { ChildProcess } from "ChildProcess/lib/mod.ts";

export class PipedCommand extends Deno.Command {

    constructor(command: string, options: Omit<Deno.CommandOptions, 'stdin' | 'stdout' | 'stderr'>) {
        super(command, { ...options, stdin: 'piped', stdout: 'piped', stderr: 'piped' })
    }

    spawn() { return new ChildProcess(super.spawn()) }

}