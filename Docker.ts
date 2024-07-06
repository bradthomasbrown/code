import { exitHandlers } from './exitHandlers.ts'
import * as schemas from './schemas/mod.ts'
import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.1.1/lib/mod.ts'

type RunOptions = {
    exitHandlers:(()=>void)[]
}

export class Docker {

    static async run(image:string, options?:RunOptions) {
        const args = ['run', '-d', '--rm', image]
        const cmdOut = await new Deno.Command('docker', { args, stdout: 'piped', stderr: 'piped' }).output()
        const id = new TextDecoder().decode(cmdOut.stdout).replace('\n', '')
        ;(options?.exitHandlers ?? exitHandlers).push(() => Docker.stop(id))
        return id
    }

    static async inspect(id:string) {
        const args = ['inspect', id]
        const cmdOut = await new Deno.Command('docker', { args, stdout: 'piped', stderr: 'piped' }).output()
        const out = new TextDecoder().decode(cmdOut.stdout)
        const jsonParseResult = jra.schemas.json.parse(JSON.parse(out))
        const dockerInspectParseResult = schemas.Inspection.parse(jsonParseResult)
        return dockerInspectParseResult
    }

    static stop(id:string) {
        new Deno.Command('docker', { args: ['stop', id], stdout: 'piped', stderr: 'piped' }).output()
    }

}