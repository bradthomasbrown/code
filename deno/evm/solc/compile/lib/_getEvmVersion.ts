import * as SV from '../../../../stdplus/semver/lib/mod.ts'

export function getEvmVersion(version:string, excludeOpcodes?:string[]) {
    const semver = SV.parse(version)
    const semverGreaterOrEqual = (v:string) => SV.greaterOrEqual(semver, SV.parse(v))
    if (excludeOpcodes?.includes('PUSH0') && semverGreaterOrEqual('0.8.20')) return 'paris'
    if (semverGreaterOrEqual('0.8.25')) return 'cancun'
    if (semverGreaterOrEqual('0.8.20')) return 'shanghai'
    if (semverGreaterOrEqual('0.8.18')) return 'paris'
    if (semverGreaterOrEqual('0.8.7')) return 'london'
    if (semverGreaterOrEqual('0.8.5')) return 'berlin'
    if (semverGreaterOrEqual('0.5.14')) return 'istanbul'
    if (semverGreaterOrEqual('0.5.5')) return 'petersburg'
    if (semverGreaterOrEqual('0.4.21')) return 'byzantium'
    return undefined
}