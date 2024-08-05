import * as SV from '../../../std/semver/mod.ts'

export function getEvmVersion(version:string, exclude?:string[]) {
    let semver = SV.parse(version)
    if (exclude?.includes('PUSH0')) semver = SV.min(semver, SV.parse('0.8.19'))
    if (SV.greaterOrEqual(semver, SV.parse('0.8.25'))) return 'cancun'
    if (SV.greaterOrEqual(semver, SV.parse('0.8.20'))) return 'shanghai'
    if (SV.greaterOrEqual(semver, SV.parse('0.8.18'))) return 'paris'
    if (SV.greaterOrEqual(semver, SV.parse('0.8.7'))) return 'london'
    if (SV.greaterOrEqual(semver, SV.parse('0.8.5'))) return 'berlin'
    if (SV.greaterOrEqual(semver, SV.parse('0.5.14'))) return 'istanbul'
    if (SV.greaterOrEqual(semver, SV.parse('0.5.5'))) return 'petersburg'
    if (SV.greaterOrEqual(semver, SV.parse('0.4.21'))) return 'byzantium'
    return undefined
}