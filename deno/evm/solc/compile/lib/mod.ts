import { PipedCommand } from '../../../../stdplus/piped-command/lib/mod.ts'
import { Cache } from '../../../../stdplus/cache/lib/mod.ts';
import { List } from '../../list/lib/mod.ts'
import { Release } from '../../release/lib/mod.ts'
import { createSourceMap } from './_createSourceMap.ts'
import { getEvmVersion } from './_getEvmVersion.ts'
import { Params } from '../types/Parameters.ts';

export async function compile({
    targets,
    basePath,
    includePaths,
    excludePaths,
    remappings,
    optimizer={ enabled: false, runs: 0 },
    viaIR,
    cacheDir=`${Deno.env.get('HOME')!}/.deno-evm/solc`,
    excludeOpcodes
}: Params) {

    const cache = new Cache(cacheDir)

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

    const proc = new PipedCommand(`${cacheDir}/${release}`, { args: ['--standard-json'] }).spawn()
    await proc.writeAndClose(inputBytes)
    const cmdOut = await proc.output()

    if (cmdOut.stderrText) throw new Error('compile error', { cause: cmdOut.stderrText })
    return cmdOut.stdoutText

}