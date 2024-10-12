import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { string } from "../../../jra/schemas/string.ts";
import { checksum } from "../../../lib/checksum/lib/mod.ts";

declare namespace IZipList {
    type Bs_Cs<B, C> = (bs: Iterable<B>) => Iterable<C>
    type As__Bs_Cs<A, B, C> = (as: Iterable<A>) => Bs_Cs<B, C>
    type B_C<B, C> = (b: B) => C
    type A__B_C<A, B, C> = (a: A) => B_C<B, C>
    type A__B_C____As__Bs_Cs<A, B, C> = (a__b_c: A__B_C<A, B, C>) => As__Bs_Cs<A, B, C>
    type zipWith = <A, B, C>(f: (a: A, b: B) => C, as: Iterable<A>, bs: Iterable<B>) => Iterable<C>
}

type ExtractIterableType<I extends Iterable<unknown>> =
    I extends { [Symbol.iterator]: () => Iterator<infer Type> }
        ? Type
        : I

type IterableCrunch<
    Is extends Iterable<unknown>[],
    Acc extends unknown[] = []
> =
    Is extends []
        ? Acc
        : Is extends [
            infer Head extends Iterable<unknown>,
            ...infer Tail extends Array<Iterable<unknown>>
        ]
            ? IterableCrunch<Tail, [...Acc, ExtractIterableType<Head>]>
            : never

function* iterableCrunch<
    Iters extends [Iterable<unknown>, ...Array<Iterable<unknown>>],
>(...iters: Iters): IterableIterator<IterableCrunch<Iters>> {
    const itors = iters.map(iter => iter[Symbol.iterator]())
    while (true) {
        const values: unknown[] = []
        for (const itor of itors) {
            const { done, value } = itor.next()
            if (done) return
            values.push(value)
        }
        yield (<IterableCrunch<Iters>>values)
    }
}

const fnApp2 = <A, B, C>(f: (a: A, b: B) => C, [a, b]: [A, B]) => f(a, b)

const zip = <A, B>(as: Iterable<A>, bs: Iterable<B>): Iterable<[A, B]> => iterableCrunch(as, bs)

const zipWith: IZipList.zipWith = function* (f, as, bs) {
    for (const [a, b] of iterableCrunch(as, bs)) {
        yield(f(a, b))
    }
}

class ZipList<T> implements Iterable<T> {

    private value: Iterable<T>

    constructor(value: Iterable<T>) {
        this.value = value
    }

    static pure<T>(x: T): ZipList<T> {
        return new ZipList(function* () {
            while (true) yield x
        }())
    }

    static liftA2<A, B, C>(f: (a: A, b: B) => C): (as: Iterable<A>, bs: Iterable<B>) => ZipList<C> {
        return (as, bs) => new ZipList(zipWith(f, as, bs))
    }

    take(n: number): ZipList<T> {
        return new ZipList((function* (this: ZipList<T>) {
            let i = 0
            for (const x of this.value) {
                if (i >= n) break
                yield x
                i++
            }
        }).bind(this)())
    }

    [Symbol.iterator](): Iterator<T> {
        return this.value[Symbol.iterator]()
    }

}

// type aa_a<A> = (a0: A, a1: A) => A
// const as = [1, 2, 3]
// const bs = [4, 5, 6]
// const cs = ZipList.pure(7)
// const add: aa_a<number> = (a, b) => a + b
// const mul: aa_a<number> = (a, b) => a * b
// const div: aa_a<number> = (a, b) => a / b
// const bar = [add, mul, div]
// const zipAdd = ZipList.liftA2(add)

// const boo = [...zipWith(add, as, bs)]
// boo: [5, 7, 9]

// const far = [...zipWith(add, as, cs)]
// far: [8, 9, 10]

// const faz = [...zipWith(fnApp2, bar, zip(as, bs))]
// faz: [5, 10, 0.5]

// const goo = [...zipAdd(bs, cs)]
// goo: [11, 12, 13]

// const gar = [...cs.take(10)]
// gar: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]


interface TypedValue<V, T> {
    value: V,
    type: T,
};

enum TypeVariability {
    static,
    dynamic
}

abstract class Type {

    // toTypedValue<A>(this: T, given: A, f: (a: A) => V): TypedValue<V, T> {
    //     return { value: f(given), type: this };
    // }

    abstract getVariability(): TypeVariability

}

class StaticType extends Type {

    getVariability(): TypeVariability.static {
        return TypeVariability.static;
    }

}

class DynamicType extends Type {
    
    getVariability(): TypeVariability.dynamic {
        return TypeVariability.dynamic;
    }

}

type BigintRange = [bigint, bigint]

function bigintRangeFromBitsAndSign(numBits: number, isSigned: boolean): BigintRange {
    const bigBits = BigInt(numBits);
    const foo = 1n << bigBits
    const bar = foo >> 1n
    const sRange: BigintRange = [-bar, bar - 1n]
    const uRange: BigintRange = [0n, foo - 1n]
    return isSigned ? sRange : uRange
}

function bigintRangerFromBigintRange([min, max]: BigintRange): (n: bigint) => boolean {
    return n => n >= min && n <= max;
}

type IntegerTypeOptions = {
    numBits: number,
    isSigned: boolean
}

class IntegerType extends StaticType {

    private readonly ranger: (n: bigint) => boolean;

    constructor({ numBits, isSigned }: IntegerTypeOptions) {
        super()
        const range = bigintRangeFromBitsAndSign(numBits, isSigned)
        this.ranger = bigintRangerFromBigintRange(range)
    }
    
    // toTypedValue(value: unknown): TypedValue<bigint, IntegerType> {
    //     let n: bigint;

    //     if (typeof value == "bigint") {
    //         n = value;
    //     } else if (typeof value == "number" && Number.isInteger(value)) {
    //         n = BigInt(value);
    //     } else {
    //         throw new Error(`expected integer, got ${value}`);
    //     }

    //     if (n < this.min() || n > this.max()) {
    //         throw new Error(`value out of range`);
    //     }
        
    //     return { value: n, type: this };
    // }

}

declare const _s: unique symbol;
type _ts = typeof _s
type _n = _ts[]
type _n_x = [[], [_ts]]

type _sAdd<X extends _n, Y extends _n> = [...X, ...Y]
type _sX2<N extends _n> = _sAdd<N, N>
type _sLen<N extends _n> = N["length"]

// // verbose
// type _sDoubleX<
//     NumberN extends _n = _n_one,
//     Repeat extends number = 1,
//     IndexN extends _n = _n_one,
//     Index extends number = IndexN["length"],
//     DoubledNumberN extends _n = [...NumberN, ...NumberN],
//     NextIndexN extends _n = [...IndexN, ..._n_one]
// > = Index extends Repeat
//     ? DoubledNumberN
//     : _sDoubleX<
//         DoubledNumberN,
//         Repeat,
//         NextIndexN>

type _sX2X<V extends [_n, number]>
    = _sLen<V[0]> extends V[1]
        ? V[0]
        : _sX2X<[_sX2<V[0]>, V[1]]>

// // verbose
// type _sFooX<
//     Repeat extends number = 1,
//     Number extends _n = _n_one,
//     IndexN extends _n = _n_one,
//     Union extends _n = Number,
//     Index extends number = IndexN["length"],
//     DoubledNumber extends _n = _sDoubleX<Number>,
//     NextIndexN extends _n = [...IndexN, ..._n_one],
//     NextUnion extends _n = Union | [...Number, ...Union]
// > = Index extends Repeat
//     ? NextUnion["length"]
//     : _sFooX<
//         Repeat,
//         DoubledNumber,
//         NextIndexN,
//         NextUnion>
// SHA256("{ k * N | k ∈ ℤ, 1 ≤ k ≤ 2^R }") = 2f5ed6c2a6473c0748698657b1a47550e6972313ea853ad684ea1897edba981
type _sGeoUnion_2f5ed6c2<V extends [_n, number, _n]>
    = _sLen<V[0]> extends V[1]
        ? _sLen<V[2]>
        : _sGeoUnion_2f5ed6c2<[_sX2<V[0]>, V[1], V[2] | _sAdd<V[0], V[2]>]>

type _n_8 = _sX2X<[_n_x[1], 8]>

// SHA256("{ k * 8 | k ∈ ℤ, 1 ≤ k ≤ 2^5 }") = 43805b59a0342d5d6f7fc21d4487577ee00347d049c0cbbeb4826998e9669ac1
type _sGeoUnion_43805b59 = _sGeoUnion_2f5ed6c2<[_n_8, 256, _n_8]>
type IntegerTypeKeys = `${"" | "u"}int${_sGeoUnion_43805b59}`

const integerTypes = [true, false]
    .reduce((p, isSigned) =>
        (Array(32).fill(0).reduce((_p, _c, i) =>
            (numBits => p[`${isSigned ? '' : 'u'}int${<_sGeoUnion_43805b59>numBits}`]
                = new IntegerType({ isSigned, numBits }))(8 + i * 8)
                    , p), p),
                        <Record<IntegerTypeKeys, IntegerType>>{})

class AddressType extends StaticType {

    // toTypedValue(value: unknown): TypedValue<string, AddressType> {
    //     if (typeof value != "string") {
    //         throw new Error(`expected string, got ${value}`);
    //     } else if (value != checksum(value)) {
    //         throw new Error(`invalid checksum`);
    //     }

    //     return { value, type: this };
    // }

}

class BooleanType extends StaticType {

    // toTypedValue(value: unknown): TypedValue<boolean, BooleanType> {
    //     if (typeof value != "boolean") {
    //         throw new Error(`expected boolean, got ${value}`);
    //     }

    //     return { value, type: this };
    // }
    
}

type FixedBytesTypeOptions = {
    numBytes: number
}

class FixedBytesType extends StaticType {

    readonly numBytes: number;

    constructor(options: FixedBytesTypeOptions) {
        super();
        const { numBytes } = options;
        if (numBytes <= 0 || numBytes > 32) {
            throw new Error(`invalid numBytes ${numBytes}`);
        }
        this.numBytes = numBytes;
    }

    // toTypedValue(value: unknown): TypedValue<Uint8Array, FixedBytesType> {
    //     let bytes: Uint8Array;

    //     if (typeof value == "string") {
    //         const generalRegex = /^(0x)?([0-9A-Fa-f]{2}){1,32}$/;
    //         if (!value.match(generalRegex)) {
    //             throw new Error(`invalid bytes string (1-32 bytes)`);
    //         }

    //         const lengthRestrictRegex = new RegExp(`^(0x)?([0-9A-Fa-f]{2}){${this.numBytes}}$`);
    //         if (!value.match(lengthRestrictRegex)) {
    //             throw new Error(`invalid bytes string (expected ${this.numBytes} bytes)`);
    //         }

    //         bytes = new Uint8Array(
    //             value
    //                 .replace(/^0x/, "")
    //                 .match(/.{2}/g)!
    //                 .map(byte => parseInt(byte, 16))
    //         );
    //     } else if (value instanceof Uint8Array) {
    //         if (value.length != this.numBytes) {
    //             throw new Error(`expected ${this.numBytes} bytes, got ${value.length}`);
    //         }
    //         bytes = value;
    //     } else {
    //         throw new Error(`expected string or Uint8Array, got ${value}`);
    //     }

    //     return { value: bytes, type: this };
    // }

}

abstract class IterableType extends Type<Iterable<unknown>, IterableType> {

    // toTypedValue<A>(value: A, f: (a: A) => Countable): TypedValue<Countable, CountableType> {
    //     return super.toTypedValue(value, f);
    // }

}

type ArrayTypeOptions<V, T extends Type<V, T>> = {
    baseType: Type<V, T>
    length?: number
}

class ArrayType<V, T extends Type<V, T>> extends Type<V[], ArrayType<V, T>> {

    readonly baseType: Type<V, T>;
    readonly length?: number;

    constructor(options: ArrayTypeOptions<V, T>) {
        super();
        const { baseType, length } = options;
        this.baseType = baseType;
        this.length = length;
    }

    override getVariability(): TypeVariability {
        if (this.length !== undefined)
            return this.baseType.getVariability();
        else
            return TypeVariability.dynamic;
    }

    // toTypedValue(values: unknown): TypedValue<V[], ArrayType<V, T>> {
    //     if (!Array.isArray(values)) {
    //         throw new Error(`Expected an array, got ${typeof values}`);
    //     }
        
    //     if (this.length !== undefined && values.length != this.length) {
    //         throw new Error(`expected ${this.length} values, got ${values.length}`);
    //     }

    //     const value = values.map(value => this.baseType.toTypedValue(value).value);

    //     return { value, type: this }
    // }

}

class BytesType extends CountableType {

    // toTypedValue(value: unknown): TypedValue<Uint8Array, BytesType> {
    //     let bytes: Uint8Array;

    //     if (typeof value == "string") {
    //         if (!value.match(/^(0x)?([0-9A-Fa-f]{2})+$/)) {
    //             throw new Error(`invalid bytes string`);
    //         }
    //         // const hex = ;
    //         // const padded = hex.padEnd(64 * (1 + Math.floor((hex.length - 1) / 64)), "0")
    //         // bytes = new Uint8Array(padded.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    //         bytes = new Uint8Array(value.replace(/^0x/, "").match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    //     } else if (value instanceof Uint8Array) {
    //         // bytes = new Uint8Array((x => (x.length = 32 * (1 + Math.floor((value.length - 1) / 32)), x))([...value]));
    //         bytes = value
    //     } else {
    //         throw new Error(`expected string or Uint8Array, got ${value}`);
    //     }

    //     return { value: bytes, type: this };
    // }

}

class StringType extends BytesType {
    
    // toTypedValue(value: unknown): TypedValue<Uint8Array, StringType> {
    //     if (typeof value != "string") {
    //         throw new Error(`expected string, got ${value}`);
    //     }

    //     return super.toTypedValue(new TextEncoder().encode(value));
    // }

}

class TypeEncoder {

    static encode<V, T extends Type<V, T>>({ value, type }: TypedValue<V, T>): string {
        if (type instanceof IntegerType) {
            return this.encodeInteger(value, type);
        } else if (type instanceof AddressType) {
            return this.encodeAddress(value);
        } else if (type instanceof BooleanType) {
            return this.encodeBoolean(value);
        } else if (type instanceof FixedBytesType) {
            return this.encodeFixedBytes(value);
        } else if (type instanceof ArrayType) {
            return this.encodeArray(value, type);
        } else if (type instanceof IterableType) {
            return this.encodeIterable(value, type);
        // } else if (type instanceof BytesType) {
        //     return this.encodeBytes(<Uint8Array>value);
        } else {
            throw new Error(`unimplemented type: ${type}`);
        }
    }

    private static encodeInteger(value: bigint, type: IntegerType): string {
        if (type.isSigned && value < 0n) {
            const mask = (1n << 256n) - 1n;
            value = ((~BigInt(-value) & mask) + 1n) & mask;
        }

        return value.toString(16).padStart(64, "0");
    }

    private static encodeAddress(value: string): string {
        const uint160 = new IntegerType({ numBits: 160, isSigned: false });
        const typedValue = uint160.toTypedValue(BigInt(value));
        return this.encode(typedValue);
    }

    private static encodeBoolean(value: boolean): string {
        const uint8 = new IntegerType({ numBits: 8, isSigned: false });
        const typedValue = uint8.toTypedValue(BigInt(value));
        return this.encode(typedValue);
    }

    private static encodeFixedBytes(value: Uint8Array): string {
        return [...value].reduce((p, c) => p + c.toString(16).padStart(2, "0"), "").padEnd(64, "0");
    }

    private static encodeArray<T extends Type<unknown, T>>(value: unknown[], type: ArrayType<unknown, T>): string {
        const types = value.map(_ => type.baseType);
        if (type.getVariability() == TypeVariability.static) {
            return this.encodeIndexedTuple(value, types);
        } else {
            const k = value.length;
            const uint256 = new IntegerType({ numBits: 256, isSigned: false });
            const encKTypedValue = uint256.toTypedValue(BigInt(k));
            const encK = this.encode(encKTypedValue);
            return encK + this.encodeIndexedTuple(value, types);
        }
    }

    private static encodeIterable(value: Iterable<unknown>, type: IterableType): string {
        const k = [...value].length;
        const uint256 = new IntegerType({ numBits: 256, isSigned: false });
        const encKTypedValue = uint256.toTypedValue(BigInt(k));
        const encK = this.encode(encKTypedValue);
        return encK + this.encode
    }

    private static encodeBytes(value: Uint8Array): string {
        const k = BigInt(value.length);
        const uint256 = new IntegerType({ numBits: 256, isSigned: false });
        const encKTypedValue = uint256.toTypedValue(k);
        const encK = this.encode(encKTypedValue);
        const padded = new Uint8Array((x => (x.length = 32 * (1 + Math.floor((value.length - 1) / 32)), x))([...value]));
        return encK + [...padded].reduce((p, c) => p + c.toString(16).padStart(2, "0"), "");
    }

    private static encodeIndexedTuple<T extends Type<unknown, T>, Ts extends Array<Type<unknown, T>>>(values: unknown[], types: Ts): string {
        let heads = "";
        let tails = "";
        for (let i = 0; i < values.length; i++) {
            const iValue = values[i];
            const iType = types[i];
            if (iType.getVariability() == TypeVariability.static) {
                heads += this.encode(iType.toTypedValue(iValue));
            } else {
                const tailOffset = values.length * 32 + tails.length / 2
                const uint256 = new IntegerType({ numBits: 256, isSigned: false });
                const tailOffsetTypedValue = uint256.toTypedValue(BigInt(tailOffset));
                heads += this.encode(tailOffsetTypedValue);
                tails += this.encode(iType.toTypedValue(iValue));
            }
        }
        return heads + tails;
    }

}

// const dynamicUint256Array = new ArrayType({ baseType: new IntegerType({ numBits: 256, isSigned: false }) });
// const typeValue = dynamicUint256Array.toTypedValue([0n, 1n, 2n, 3n]);
const bytes = new BytesType();
// 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
const typeValue = bytes.toTypedValue("0x1234");
console.log(TypeEncoder.encode(typeValue));
