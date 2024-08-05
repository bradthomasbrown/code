import * as Path from 'https://deno.land/std@0.224.0/path/mod.ts'
import { Cache } from '../../../std/cache/Cache.ts'
import { PipedCommand } from '../../../std/beno/PipedCommand.ts'
import { solcJsonOutputObject } from '../schemas/_solcJsonOutputObject.ts';
import { SolcJsonInput } from './_SolcJsonInput.ts'
import { fetchSolcRelease } from './_fetchSolcRelease.ts'
import { SolcJsonOutput } from './SolcJsonOutput.ts'
import { SolcList } from './_SolcList.ts';

export async function compile2(code:string):Promise<string> {

}

/**
 * given a solc json input path, return the compilation results
 * @param solcJsonInputPath
 */
export async function compile({
    solcJsonInputPath,
    basePath,
    includePaths
}:{
    solcJsonInputPath:string
    basePath?:string
    includePaths?:string[]
}):Promise<SolcJsonOutput> {
    const cache = new Cache(Deno.env.get('HOME')!)
    const solcList = await SolcList.get()
    const [_version, release] = solcList.maxSatisfying(codeArray)
    await fetchSolcRelease(release)
    const proc = new PipedCommand(`${cache.root}/${release}`, { args: ['--standard-json'] }).spawn()
    proc.writeAndClose(solcJsonInput.toUint8Array())
    const cmdOut = await proc.output()
    if (cmdOut.stderrText) throw new Error('compile error', { cause: cmdOut.stderrText })
    return new SolcJsonOutput(cmdOut.stdoutText)
}