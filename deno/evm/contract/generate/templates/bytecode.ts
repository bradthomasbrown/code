import { $E, $T } from "../../../../stdplus/templar/lib/mod.ts";

const { link } = $E<typeof import('./_link.ts')>`link`
const { bytecode: bytecodeString } = $E<typeof import('./_bytecodeString.ts')>`bytecodeString`
const { refs } = $E<typeof import('./_refs.ts')>`refs`

type ByIndex = $T<string[],`ByIndex`>
type ByName = $T<Record<string, string>,`ByName`>

export function bytecode($P:ByIndex&`paramsByIndex`): string
export function bytecode($P:ByName&`paramsByName`): string
export function bytecode(...params: ByIndex | [ByName]): string {
    return link(bytecodeString, refs, params)
}