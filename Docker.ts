import { ExitHandlers } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/ExitHandlers@0.0.1/mod.ts'
import * as schemas from './schemas/mod.ts'
import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.1.1/lib/mod.ts'

export class Docker {

    static async run(image:string, exitHandlers:ExitHandlers) {
        const args = ['run', '-d', '--rm', image]
        const stderr = 'piped', stdout = 'piped'
        const options = { args, stderr, stdout } as const
        const cmdOut = await new Deno.Command('docker', options).output()
        const id = new TextDecoder().decode(cmdOut.stdout).replace('\n', '')
        exitHandlers.push(() => Docker.stop(id))
        return id
    }

    static async exec(image:string) {
        const args = ['run', '--rm', image]
        const stderr = 'piped', stdout = 'piped'
        const options = { args, stderr, stdout } as const
        const cmd = new Deno.Command('docker', options)
        const proc = cmd.spawn()
        let buf = new Uint8Array([])
        for await (const values of proc.stdout.values()) buf = new Uint8Array([...buf, ...values])
        await proc.status
        return new TextDecoder().decode(buf)
    }

    static async inspect(id:string) {
        const args = ['inspect', id]
        const stderr = 'piped', stdout = 'piped'
        const options = { args, stderr, stdout } as const
        const cmdOut = await new Deno.Command('docker', options).output()
        const out = new TextDecoder().decode(cmdOut.stdout)
        const jsonParseResult = jra.schemas.json.parse(JSON.parse(out))
        const dockerInspectParseResult = schemas.Inspection.parse(jsonParseResult)
        return dockerInspectParseResult
    }

    static stop(id:string) {
        const args = ['stop', id]
        const stderr = 'piped', stdout = 'piped'
        const options = { args, stderr, stdout } as const
        new Deno.Command('docker', options).output()
    }

}