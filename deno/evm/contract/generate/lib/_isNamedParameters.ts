export function isNamedParameters<I, N>(parameters: I | N, signature: string): parameters is N {
    return true
}