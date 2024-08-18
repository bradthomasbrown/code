import * as SV from 'https://deno.land/std@0.224.0/semver/mod.ts'

export function max(...versions:[SV.SemVer, ...SV.SemVer[]]) {
    return versions.reduce((p, c) => SV.greaterThan(c, p) ? c : p)
}