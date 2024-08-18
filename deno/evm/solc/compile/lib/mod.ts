import { PipedCommand } from 'std/beno/PipedCommand.ts'
import { Cache } from 'std/cache/Cache.ts';
import { List } from "solc/List/lib/mod.ts"
import { Release } from "solc/Release/lib/mod.ts"
import { createSourceMap } from "solc/compile/lib/_createSourceMap.ts"
import { getEvmVersion } from "solc/compile/lib/_getEvmVersion.ts"

const defaultCacheDir = `${Deno.env.get('HOME')!}/.kaaos/solc`

export async function compile({
    targets,
    basePath,
    includePaths,
    excludePaths,
    remappings,
    optimizer={ enabled: false, runs: 0 },
    viaIR,
    cacheDir,
    excludeOpcodes
}:{
    targets: Record<string, string[]>
    basePath?: string
    includePaths?: string[]
    excludePaths?: string[]
    remappings?: string[],
    optimizer?: { enabled: boolean, runs: number },
    viaIR?: true,
    cacheDir?: string,
    excludeOpcodes?: string[]
}) {

    const cache = new Cache(cacheDir ?? defaultCacheDir)

    const requiredSources = Object.keys(targets)
    const sourceMap = await createSourceMap({ requiredSources, basePath, includePaths, excludePaths, remappings })

    const list = await List.get(cache)
    const codeArray = [...sourceMap.values()]
    const [version, release] = list.maxSatisfying(codeArray)
    await Release.ensure(release, cache)

    const language = 'Solidity'
    const sources = [...sourceMap.entries()].reduce<Record<string, { content: string }>>(
        (p, [source, content]) => (p[source] = { content }, p), {})
    const evmVersion = getEvmVersion(version, excludeOpcodes)
    const outputSelection = Object.entries(targets).reduce<Record<string, Record<string, string[]>>>(
        (p, [source, contracts]) => (p[source] = contracts.reduce<Record<string, string[]>>(
            (p, contract) => (p[contract] = ['abi', 'evm.bytecode.object', 'evm.bytecode.linkReferences', 'evm.bytecode.opcodes'], p), {}), p), {})
    const settings = { remappings, optimizer, evmVersion, outputSelection, viaIR }
    const input = { language, sources, settings }
    const inputBytes = new TextEncoder().encode(JSON.stringify(input))

    const proc = new PipedCommand(`${defaultCacheDir}/${release}`, { args: ['--standard-json'] }).spawn()
    await proc.writeAndClose(inputBytes)
    const cmdOut = await proc.output()

    if (cmdOut.stderrText) throw new Error('compile error', { cause: cmdOut.stderrText })
    return cmdOut.stdoutText

}