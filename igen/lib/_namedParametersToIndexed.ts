export function namedParametersToIndexed<I, N extends [object]>(parameters: N, parameterNames: string[]):I {
    return Object.keys(parameters[0]) as I
}