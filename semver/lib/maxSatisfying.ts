import * as SV from 'https://deno.land/std@0.224.0/semver/mod.ts'
import { max } from './max.ts'

export function maxSatisfying(versions: SV.SemVer[], range: SV.Range): SV.SemVer | undefined
export function maxSatisfying(versions: SV.SemVer[], ranges: SV.Range[]): SV.SemVer | undefined
export function maxSatisfying(versions: SV.SemVer[], param1: SV.Range | SV.Range[]): SV.SemVer | undefined {
    if (SV.isRange(param1)) return SV.maxSatisfying(versions, param1)
    const satisfyingVersions = versions.filter(version => param1.every(range => SV.satisfies(version, range)))
    return satisfyingVersions.length ? max(...satisfyingVersions as [SV.SemVer, ...SV.SemVer[]]) : undefined
}