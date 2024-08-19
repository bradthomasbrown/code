type SourceName = string
type ContractName = string

interface Sources { [key: SourceName]: ContractName[] }

export type Params = {
    targets: Sources
    basePath?: string
    includePaths?: string[]
    excludePaths?: string[]
    remappings?: string[]
    optimizer?: { enabled: boolean, runs: number }
    viaIR?: true
    cacheDir?: string
    excludeOpcodes?: string[]
}