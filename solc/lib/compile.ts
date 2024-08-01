import * as Path from 'https://deno.land/std@0.224.0/path/mod.ts'
import { solcJsonOutputObject } from '../schemas/_solcJsonOutputObject.ts';
import { SolcJsonInput } from './_SolcJsonInput.ts'
import { fetchSolcRelease } from './_fetchSolcRelease.ts'
import { SolcJsonOutput } from './SolcJsonOutput.ts'

/**
 * given a solc json input path, return the compilation results
 * @param solcJsonInputPath
 */
export async function compile(solcJsonInputPath:string):Promise<SolcJsonOutput> {
    const solcJsonInput = await SolcJsonInput.fromPath(solcJsonInputPath)
    const cacheDir = `${Deno.env.get('HOME')!}/.kaaos/solc`
    if (!await Deno.stat(cacheDir).catch(() => undefined)) await Deno.mkdir(cacheDir, { recursive: true })
    const release = await solcJsonInput.bestRelease()
    await fetchSolcRelease(release)
    const args = ['--standard-json', '--allow-paths', solcJsonInput.sourcePaths().join()]
    const options = { args, stdin: 'piped', stdout: 'piped', stderr: 'piped', cwd: Path.dirname(solcJsonInputPath) } as const
    const proc = new Deno.Command(`${Deno.env.get('HOME')!}/.kaaos/solc/${release}`, options).spawn()
    const writer = proc.stdin.getWriter()
    await writer.write(new TextEncoder().encode(solcJsonInput.toString()))
    await writer.close()
    const commandOutput = await proc.output()
    if (commandOutput.stderr.length) throw new Error('compile error', { cause: new TextDecoder().decode(commandOutput.stderr) })
    return new SolcJsonOutput(solcJsonOutputObject.parse(JSON.parse(new TextDecoder().decode(commandOutput.stdout))))
}