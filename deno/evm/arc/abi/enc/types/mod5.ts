class ConversionError extends Error {}

function numberToBigInt(n: number): bigint {
    const m: bigint = BigInt(n)
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/30540
    const [min, max] = [
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
    ]

    if (n < min || n > max) {
        throw new ConversionError(
            "Number outside of safe integer range",
            { cause: { n, m } }
        )
    }
        
    return m
}

const _identifier = Symbol("Integer")

interface Bar {
    value: bigint
    [_identifier]: typeof _identifier
}

interface Subtype {
    numBits: bigint
    isSigned: boolean
}

function bigintToSolLibAstInteger(subtype: Subtype, n: bigint): Bar {
    const { numBits, isSigned } = subtype

    const [min, max] = isSigned ? [
        -(1n << numBits - 1n),
        (1n << numBits - 1n) - 1n
    ] : [
        0n,
        (1n << numBits) - 1n
    ]
        
    if (n < min || n > max) {
        throw new ConversionError(
            "Number outside of bounds",
            { cause: { n, min, max } }
        )
    }

    return {
        value: n,
        [_identifier]: _identifier
    }
}

// console.log(foo(Number.MIN_SAFE_INTEGER).value << 1n >> 1n)
// console.log(foo(Number.MAX_SAFE_INTEGER).value << 1n >> 1n)

