import { WalkOptions, walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { dirname, resolve } from "https://deno.land/std@0.224.0/path/mod.ts";
import { globToRegExp } from "https://deno.land/std@0.224.0/path/glob_to_regexp.ts";

export async function createSourceMap({
    requiredSources,
    basePath,
    includePaths,
    excludePaths,
    remappings
}:{
    requiredSources: string[]
    basePath?: string
    includePaths?: string[]
    excludePaths?: string[]
    remappings?: string[]
}) {

    const normalizedRemappings = remappings?.map(remapping => remapping.split('=')) ?? []
    const roots = [basePath ?? Deno.cwd(), ...(includePaths ?? [])]
    const requiredSourcesSet = new Set<string>([...requiredSources])
    const sourceToCodeMap = new Map<string,string>()
    const sourceToPathMap = new Map<string,string>()

    const applyRemappings = (source:string) => normalizedRemappings.reduce((source, [from, to]) => source.replace(from, to), source)
    const pathToSource = (path: string, root:string) => path.replace(`${root == basePath ? root : dirname(root)}/`, '')
    const codeToImportLines = (code: string):string[] => code.match(/^import\b.+?(['"])(.+)\1/mg) ?? []
    const importLineToImportPath = (importLine: string) => applyRemappings(importLine.match(/^import\b.+?(['"])(.+)\1/)![2])
    const codeToImportPaths = (code:string) => codeToImportLines(code).map(importLineToImportPath)
    const sourceResolve = (rootSource:string, pathSegment:string) => resolve(dirname(`/${rootSource}`), pathSegment).replace(/^\//, '')
    const isAbsoluteSource = (source:string) => !source.match(/^\./)
    const sourceResolver = (rootSource:string) => (pathSegment:string) => isAbsoluteSource(pathSegment) ? pathSegment : sourceResolve(rootSource, pathSegment)
    const getImportSources = (code:string, rootSource:string) => codeToImportPaths(code).map(sourceResolver(rootSource))

    const fulfillSourceRequirement = async (source:string) => {
        const path = sourceToPathMap.get(source)!
        const code = await Deno.readTextFile(path)
        sourceToCodeMap.set(source, code)
        for (const importSource of getImportSources(code, source))
            if (!sourceToPathMap.has(importSource)) requiredSourcesSet.add(importSource)
            else if (!sourceToCodeMap.has(importSource)) await fulfillSourceRequirement(importSource)
        requiredSourcesSet.delete(source)
    }

    const handlePath = async (path:string, root:string) => {
        const source = pathToSource(path, root)
        sourceToPathMap.set(source, path)
        if (requiredSourcesSet.has(source)) await fulfillSourceRequirement(source)
        return requiredSourcesSet.size
    }

    const walkRoot = async (root:string) => {
        const skip = (excludePaths ?? []).map(glob => globToRegExp(glob))
        const walkOptions: WalkOptions = { includeDirs: false, exts: ['.sol'], skip }
        for await (const { path } of walk(root, walkOptions)) if (!await handlePath(path, root)) return true
    }

    for (const root of roots) if (await walkRoot(root)) break
    if (!requiredSourcesSet.size) return sourceToCodeMap
    throw new Error('missing imports', { cause: { requiredSourcesSet } })
    
} 