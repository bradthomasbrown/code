import * as SV from 'https://deno.land/std@0.224.0/semver/mod.ts'

export function solidityToSvRange(code:string) {
    const matches = code.match(/pragma solidity (.+?);/)
    return SV.parseRange(matches ? matches[1] : '>=0.0.0')
}