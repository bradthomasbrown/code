import * as SV from '../../../std/semver/mod.ts'
import { PipedCommand } from '../../../std/beno/PipedCommand.ts'
import { createSourceMap } from './_createSourceMap.ts'
import { SolcList } from './_SolcList.ts'
import { SolcRelease } from './_SolcRelease.ts'
import { getEvmVersion } from './_getEvmVersion.ts'

const defaultCacheDir = `${Deno.env.get('HOME')!}/.kaaos/solc`

export async function compile({
    targets,
    basePath,
    includePaths,
    excludePaths,
    remappings,
    optimizer={ enabled: false, runs: 0 },
    viaIR
}:{
    targets: Record<string, string[]>
    basePath?: string
    includePaths?: string[]
    excludePaths?: string[]
    remappings?: string[],
    optimizer?: { enabled: boolean, runs: number },
    viaIR?: true
}) {

    const requiredSources = Object.keys(targets)
    const sourceMap = await createSourceMap({ requiredSources, basePath, includePaths, excludePaths, remappings })

    const solcList = await SolcList.get()
    const codeArray = [...sourceMap.values()]
    const [version, release] = solcList.maxSatisfying(codeArray)
    await SolcRelease.ensure(release)

    const language = 'Solidity'
    const sources = [...sourceMap.entries()].reduce<Record<string, { content: string }>>(
        (p, [source, content]) => (p[source] = { content }, p), {})
    const evmVersion = getEvmVersion(version)
    const outputSelection = Object.entries(targets).reduce<Record<string, Record<string, string[]>>>(
        (p, [source, contracts]) => (p[source] = contracts.reduce<Record<string, string[]>>(
            (p, contract) => (p[contract] = ['abi', 'evm.bytecode.object', 'evm.bytecode.linkReferences'], p), {}), p), {})
    const settings = { remappings, optimizer, evmVersion, outputSelection, viaIR }
    const solcJsonInput = { language, sources, settings }
    const solcJsonInputBytes = new TextEncoder().encode(JSON.stringify(solcJsonInput))

    const proc = new PipedCommand(`${defaultCacheDir}/${release}`, { args: ['--standard-json'] }).spawn()
    await proc.writeAndClose(solcJsonInputBytes)
    const cmdOut = await proc.output()

    if (cmdOut.stderrText) throw new Error('compile error', { cause: cmdOut.stderrText })
    return cmdOut.stdoutText

}