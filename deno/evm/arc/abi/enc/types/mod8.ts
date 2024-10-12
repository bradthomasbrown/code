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



enum TypeVariability {
    static,
    dynamic
}

abstract class Type {
    abstract variability: TypeVariability
}

interface TypedValue {
    type: Type,
    value: unknown
}

class StaticType extends Type {
    variability = TypeVariability.static
}

class DynamicType extends Type {
    variability = TypeVariability.dynamic
}

class CompositeType extends Type {
    private components: Set<Type>

    constructor(components: Set<Type>) {
        super()
        this.components = components
    }

    get variability(): TypeVariability {
        for (const component of this.components) {
            if (component.variability == TypeVariability.dynamic) {
                return TypeVariability.dynamic
            }
        }
        return TypeVariability.static
    }
}

type BigRange = [bigint, bigint]

interface GetBigRangeOptions {
    numBits: number
    isSigned: boolean
}

function getBigRange({ numBits, isSigned }: GetBigRangeOptions): BigRange {
    const bigBits = BigInt(numBits);
    const unsignedLimit = 1n << bigBits
    const signedLimit = unsignedLimit >> 1n
    const sRange: BigRange = [-signedLimit, signedLimit - 1n]
    const uRange: BigRange = [0n, unsignedLimit - 1n]
    return isSigned ? sRange : uRange
}

interface BigRanger {
    (n: bigint): boolean
}

function getBigRanger([min, max]: BigRange): BigRanger {
    return n => n >= min && n <= max;
}

class IntegerType extends StaticType {

    constructor(private readonly inRange: (n: bigint) => boolean) {
        super()
    }
    
    toTypedValue(value: unknown): TypedValue {
        let n: bigint;

        if (typeof value == "bigint") {
            n = value;
        } else if (typeof value == "number" && Number.isInteger(value)) {
            if (!Number.isInteger(value)) {
                throw new Error(`expected integer, got ${value}`);
            }
            if (!Number.isSafeInteger(value)) {
                throw new Error(`expected safe integer, got ${value}`);
            }
            n = BigInt(value);
        } else {
            throw new Error(`expected number or bigint, got ${value}`);
        }
        if (!this.inRange(n)) {
            throw new Error(`value ${n} out of range`);
        }
        
        return { type: this, value: n };
    }

}

declare const _s: unique symbol;
type _ts = typeof _s
type _n = _ts[]
type _n_x = [[], [_ts]]

type _sAdd<X extends _n, Y extends _n> = [...X, ...Y]
type _sX2<N extends _n> = _sAdd<N, N>
type _sLen<N extends _n> = N["length"]

type _sX2Til<V extends [_n, number]>
    = _sLen<V[0]> extends V[1]
        ? V[0]
        : _sX2Til<[_sX2<V[0]>, V[1]]>

// SHA256("{ k * N | k ∈ ℤ, N ≤ k ≤ 2^R }") = 4347b5edd559c0251fa5e6a3440d18502e860273cff4344038704f616d22ae12
type _sGeoUnion_4347b5ed<V extends [_n, number], U extends _n = V[0]>
    = _sLen<V[0]> extends V[1]
        ? _sLen<U>
        : _sGeoUnion_4347b5ed<[_sX2<V[0]>, V[1]], U | _sAdd<V[0], U>>

type _n_8 = _sX2Til<[_n_x[1], 8]>
// SHA256("{ k * 8 | k ∈ ℤ, 8 ≤ k ≤ 2^5 }") = 3b9277bfbcb6489e182203b1a325d68e00586ea889a2a92648dc0eef329fbdf5
type _sGeoUnion_3b9277bf = _sGeoUnion_4347b5ed<[_n_8, 256]>
type IntegerTypeKeys = `${"" | "u"}int${_sGeoUnion_3b9277bf}`

const integerTypes = [true, false]
    .reduce((p, isSigned) =>
        (Array(32).fill(0).reduce((_p, _c, i) =>
            (numBits => p[`${isSigned ? '' : 'u'}int${<_sGeoUnion_3b9277bf>numBits}`]
                = new IntegerType(getBigRanger(getBigRange({ isSigned, numBits }))))(8 + i * 8)
                    , p), p),
                        <Record<IntegerTypeKeys, IntegerType>>{})

class AddressType extends StaticType {

    toTypedValue(value: unknown): TypedValue {
        if (typeof value != "string") {
            throw new Error(`expected string, got ${value}`);
        } else if (value != checksum(value)) {
            throw new Error(`expected checksummed address ${checksum(value)}, got ${value}`);
        }

        return { type: this, value };
    }

}

class BooleanType extends StaticType {

    toTypedValue(value: unknown): TypedValue {
        if (typeof value != "boolean") {
            throw new Error(`expected boolean, got ${value}`);
        }

        return { type: this, value }
    }
    
}

type BytesMatcher = RegExp

function getBytesMatcher(numBytes: _sGeoUnion_4347b5ed<[_n_x[1], 32]>): BytesMatcher {
    return new RegExp(`^(0x)?([0-9A-Fa-f]{2}){${numBytes}}$`);
}

function* bytesGenerator(value: unknown): Generator<number> {
    switch (typeof value) {
        case "string": {
            const chars = Array.from(value.replace(/^0x/, ""))
            if (chars.length % 2) {
                throw new Error(`expected even number of characters, got ${chars.length}`);
            }
            while (chars.length) {
                yield Number(`0x${chars.splice(0, 2).join("")}`)
            }
            return
        }
        default: { 
            throw new Error(`unhandled type for value ${value}`);
        }
    }
}

class FixedBytesType extends StaticType {

    constructor(private readonly bytesMatcher: BytesMatcher) {
        super();
    }

    toTypedValue(value: unknown): TypedValue {
        let bytes: Uint8Array;

        if (typeof value == "string") {
            if (!value.match(this.bytesMatcher)) {
                throw new Error(`invalid bytes string for value ${value} (double check bytes length)`);
            }
            bytes = new Uint8Array(bytesGenerator(value))
        } else if (value instanceof Uint8Array) {
            bytes = value;
        } else {
            throw new Error(`expected string or Uint8Array, got ${value}`);
        }
        if (bytes.length > 32) {
            throw new Error(`invalid bytes length ${value} for fixed bytes type`);
        }

        return { type: this, value: bytes }
    }

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

type CFoo<T> = T extends number ? T : never
type AFoo<T extends { [K in keyof T]: 1 }> = [T, U]
type BFoo = AFoo<string>

class TypeEncoder {

    static encode(typedValue: TypedValue): string {
        if () {
            typedValue
            return this.encodeInteger(ctv.value, ctv.type);
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
