import { assert } from 'jsr:@std/assert'
import { decodeHex, encodeHex } from "jsr:@std/encoding";
import { checksum } from '../../../lib/checksum/lib/mod.ts'
import * as ethersAbi from 'npm:ethers/abi'
import * as viem from 'npm:viem'
import * as web3Abi from 'npm:web3-eth-abi'

const concat = (a: string, b: string) => a + b

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
    T, Iters extends Array<Iterable<T>>,
>(...iters: Iters): IterableIterator<IterableCrunch<Iters>> {
    const itors = iters.map(iter => iter[Symbol.iterator]())
    while (true) {
        const values: T[] = []
        for (const itor of itors) {
            const { done, value } = itor.next()
            if (done) return
            values.push(value)
        }
        yield (<IterableCrunch<Iters>>values)
    }
}

const zipWith: IZipList.zipWith = function* (f, as, bs) {
    for (const [a, b] of iterableCrunch(as, bs)) {
        yield f(a, b)
    }
}

function* zipFoo<
    T, Iters extends Array<Iterable<T>>, V
>(
    f: (...params: T[]) => V,
    ...iters: Iters
) {
    for (const values of iterableCrunch(...iters))
        yield f(...values)
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

    static liftA0<A>(f: () => A): () => ZipList<A> {
        return () => new ZipList(zipFoo(f))
    }

    static liftA1<A, B>(f: (a: A) => B): (as: Iterable<A>) => ZipList<B> {
        return as => new ZipList(zipFoo(f, as))
    }

    static liftA2<A, B, C>(f: (a: A, b: B) => C): (as: Iterable<A>, bs: Iterable<B>) => ZipList<C> {
        return (as, bs) => new ZipList(zipWith(f, as, bs))
    }

    take(n: number): ZipList<T> {
        const itor = this.value[Symbol.iterator]()
        return new ZipList((function* () {
            let i = 0
            while (i++ < n)
                yield itor.next().value
        })())
    }

    [Symbol.iterator](): Iterator<T> {
        return this.value[Symbol.iterator]()
    }

}

class FooMap<L> extends Map<unknown, L | FooMap<L>> {

    constructor(private readonly mkL: () => L) {
        super()
    }

    blaze(key: unknown[]): L {
        assert(key.length, "empty key in blaze")
        const [head, ...tail] = key
        if (key.length == 1) return this.getSetL(head)
        else return this.getSetM(head).blaze(tail)
    }

    getM(key: unknown): undefined | FooMap<L> {
        return this.getX<FooMap<L>>(key)
    }

    getL(key: unknown): undefined | L {
        return this.getX<L>(key)
    }

    getX<T extends L | FooMap<L>>(key: unknown): undefined | T {
        return <undefined | T>this.get(key)
    }

    setRetM(key: unknown): FooMap<L> {
        return this.setRetX(key, this.mkM)
    }

    mkM() {
        return new FooMap(this.mkL)
    }

    setRetL(key: unknown): L {
        return this.setRetX(key, this.mkL)
    }

    setRetX<F extends (() => L) | (() => FooMap<L>)>(key: unknown, fn: F): ReturnType<F> {
        return (v => (this.set(key, v), v))(<ReturnType<F>>fn())
    }

    getSetM(key: unknown): FooMap<L> {
        return this.getSetX(key, this.mkM.bind(this))
    }

    getSetL(key: unknown): L {
        return this.getSetX(key, this.mkL.bind(this))
    }

    getSetX<F extends (() => L) | (() => FooMap<L>)>(key: unknown, fn: F): ReturnType<F> {
        return this.getX(key) ?? this.setRetX<F>(key, fn)
    }

}

function isUndefined(x: unknown): x is undefined {
    return x === undefined
}

function isString(x: unknown): x is string {
    return typeof x == "string";
}

function isSymbol(x: unknown): x is symbol {
    return typeof x == "symbol";
}

function isNumber(x: unknown): x is number {
    return typeof x == "number";
}

function isIterable(x: unknown): x is Iterable<number> {
    return isNonNullableObject(x) && Symbol.iterator in x;
}

function isObject(x: unknown): x is object {
    return typeof x == "object" 
}

function isNonNullable(x: unknown): x is NonNullable<object> {
    return x !== null
}

function isNonNullableObject(x: unknown): x is NonNullable<object> {
    return isObject(x) && isNonNullable(x)
}

function isArrayLike(x: unknown): x is ArrayLike<number> {
    return isNonNullableObject(x) && "length" in x
}

function isArrayBufferLike(x: unknown): x is ArrayBufferLike {
    return x instanceof ArrayBuffer;
}

function assertNever(_: never, message: string, cause?: unknown): never {
    throw new Error(message, { cause })
}

type BigintRange = { min: bigint, max: bigint }

function bigintRange(signed: boolean, bitWidth: number): BigintRange {
    const min = signed ? -1n << BigInt(bitWidth - 1) : 0n
    const max = signed ? ~min : 1n << BigInt(bitWidth)
    return { min, max }
}

function inRange(value: bigint, min: bigint, max: bigint): boolean {
    return min <= value && value <= max
}

class TypeIdMap extends FooMap<symbol> {
    constructor() { super(() => Symbol()) }
}

const typeIdMap = new TypeIdMap()

interface Type {
    readonly sym: symbol
    get enc(): string
    get headLen(): number
    get isDynamic(): boolean
}

class _Tuple extends Array<Type> implements Type {

    readonly sym: symbol

    constructor(...items: Type[]) {
        super(...items)
        const syms: symbol[] = []
        for (const item of items) syms.push(item.sym)
        this.sym = typeIdMap.blaze(["_Tuple", ...syms])
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= this.reduce<[string, string]>((acc, type) =>
            <[string, string]>[...zipWith(
                concat,
                acc,
                this.isDynamic
                    ? [new _Int(false, this.headLen + acc[1].length / 2, 256).enc, type.enc]
                    : [type.enc, ""]
            )],
            ["", ""]
        ).reduce(concat)
    }

    private _headLen: undefined | number
    get headLen(): number {
        return this._headLen ??= this.length * 32
    }

    private _isDynamic: undefined | boolean
    get isDynamic(): boolean {
        return this._isDynamic ??= this.some(item => item.isDynamic)
    }

}

class _Array<T extends Type> extends Array<T> implements Type {

    readonly sym: symbol
    private readonly underlying: Type

    constructor(
        private readonly hasDynamicLength: boolean,
        ...items: T[]
    ) {
        assert(items.length, "empty array")

        super(...items)

        this.underlying = items[0]
        for (const item of items) assert(item.sym === this.underlying.sym, "array item type mismatch")

        this.sym = typeIdMap.blaze(["_Array", hasDynamicLength, this.underlying, hasDynamicLength ? undefined : items.length])
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= (this.hasDynamicLength ? new _Int(false, this.length, 256).enc : "")
            + new _Tuple(...this).enc
    }

    private _headLen: undefined | number
    get headLen(): number {
        return this._headLen ??= this.isDynamic ? 32 : this.length * 32
    }

    private _isDynamic: undefined | boolean
    get isDynamic(): boolean {
        return this._isDynamic ??= this.hasDynamicLength || this.underlying.isDynamic
    }

}

class _String implements Type {

    readonly sym: symbol
    readonly value: string

    constructor(value: string) {
        this.value = value
        this.sym = typeIdMap.blaze(["_String"])
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= new _Bytes(Fixity.DYNAMIC, Param.ARRAY_BUFFER_LIKE, new TextEncoder().encode(this.value)).enc
    }

    get headLen(): number {
        return 32
    }

    get isDynamic(): boolean {
        return true
    }

}

class _Address implements Type {

    readonly sym: symbol
    readonly value: string

    constructor(address: string) {
        this.value = address
        assert(address == checksum(address), `address %s not checksummed, ${address}`)
        this.sym = typeIdMap.blaze(["_Address"])
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= new _Int(false, this.value, 160).enc
    }

    get headLen(): number {
        return 32
    }

    get isDynamic(): boolean {
        return false
    }

}

class _Int implements Type {

    readonly sym: symbol
    private readonly decimalPlaces: number
    private readonly nominalValue: number | bigint

    constructor()
    constructor(signed: boolean, value: number | bigint | boolean | string, bitWidth?: number)
    constructor(signed: boolean, value: number | bigint | boolean | string, bitWidth?: number, decimalPlaces?: number)

    constructor(signed?: boolean, value?: number | bigint | boolean | string, bitWidth?: number, decimalPlaces?: number) {
        signed ??= false
        value ??= 0
        if (typeof value == "boolean") value = value ? 1 : 0
        if (typeof value == "string") value = BigInt(value)
        bitWidth ??= 256
        this.decimalPlaces = decimalPlaces ??= 0
        this.nominalValue = value
        const { min, max } = bigintRange(signed, bitWidth)

        assert(0 < bitWidth && bitWidth <= 256, `bitWidth %l not in range (0 < %l <= 256), ${bitWidth}`)
        assert(bitWidth % 8 == 0, `bitWidth %l not multiple of 8, ${bitWidth}`)
        assert(0 <= decimalPlaces && decimalPlaces <= 80, `decimalPlaces %l not in range (0 <= %l <= 80), ${decimalPlaces}`)
        assert(inRange(this.value, min, max), `value %v not in range %min <= v <= %max, ${value}, ${min}, ${max}`)

        this.sym = typeIdMap.blaze(["_Int", signed, bitWidth, decimalPlaces])
    }

    private _value: undefined | bigint
    get value(): bigint {
        return this._value ??= typeof this.nominalValue == "number"
            ? BigInt(Math.floor(this.nominalValue * 10 ** this.decimalPlaces))
            : this.nominalValue * BigInt(10 ** this.decimalPlaces)
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= BigInt.asUintN(256, this.value).toString(16).padStart(64, '0')
    }

    get headLen(): number {
        return 32
    }

    get isDynamic(): boolean {
        return false
    }

}

class _Bool implements Type {

    readonly sym: symbol
    readonly value: boolean

    constructor(value: boolean) {
        this.value = value
        this.sym = typeIdMap.blaze(["_Bool"])
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= new _Int(false, this.value, 8).enc
    }

    get headLen(): number {
        return 32
    }

    get isDynamic(): boolean {
        return false
    }

}


enum Fixity {
    DYNAMIC,
    FIXED
}
enum Param {
    EMPTY,
    NUMBER,
    STRING,
    ITERABLE,
    ARRAY_LIKE,
    ARRAY_BUFFER_LIKE,
}
class _Bytes extends Uint8Array implements Type {

    readonly sym: symbol
    readonly nominalLength: undefined | number

    constructor(fixity: Fixity.DYNAMIC, param: Param.EMPTY                                                                                )
    // # impossible # constructor(fixity: Fixity.FIXED  , param: Param.EMPTY                                                              )
    constructor(fixity: Fixity.DYNAMIC, param: Param.NUMBER           , byteCount: number                                                 )
    constructor(fixity: Fixity.FIXED  , param: Param.NUMBER           , byteCount: number                                                 )
    constructor(fixity: Fixity.DYNAMIC, param: Param.STRING           , string   : string                                                 )
    constructor(fixity: Fixity.FIXED  , param: Param.STRING           , string   : string                                                 )
    constructor(fixity: Fixity.DYNAMIC, param: Param.ITERABLE         , iterable : Iterable<number>                                       )
    constructor(fixity: Fixity.FIXED  , param: Param.ITERABLE         , iterable : Iterable<number>                                       )
    constructor(fixity: Fixity.DYNAMIC, param: Param.ARRAY_LIKE       , array    : ArrayLike<number>                                      )
    constructor(fixity: Fixity.FIXED  , param: Param.ARRAY_LIKE       , array    : ArrayLike<number>                                      )
    constructor(fixity: Fixity.DYNAMIC, param: Param.ARRAY_BUFFER_LIKE, buffer   : ArrayBufferLike  , byteOffset?: number, length?: number)
    constructor(fixity: Fixity.FIXED  , param: Param.ARRAY_BUFFER_LIKE, buffer   : ArrayBufferLike  , byteOffset?: number, length?: number)
    constructor(
        fixity: Fixity,
        param: Param,
        arg2?: number | string | Iterable<number> | ArrayLike<number> | ArrayBufferLike,
        arg3?: number,
        arg4?: number
    ) {
    
        const buf = {
            [Param.EMPTY]: new Uint8Array(),
            [Param.NUMBER]: new Uint8Array(<number>arg2),
            [Param.STRING]: decodeHex((<string>arg2).replace(/^0x/, '')),
            [Param.ITERABLE]: new Uint8Array(<Iterable<number>>arg2),
            [Param.ARRAY_LIKE]: new Uint8Array(<ArrayLike<number>>arg2),
            [Param.ARRAY_BUFFER_LIKE]: new Uint8Array(<ArrayBufferLike>arg2, arg3, arg4)
        }[param]
        super(buf)

        this.nominalLength = fixity === Fixity.FIXED ? this.length : undefined
        this.sym = typeIdMap.blaze(["_Bytes", this.nominalLength])
    }

    private _enc: undefined | string
    get enc(): string {
        return this._enc ??= (this.isDynamic ? new _Int(false, this.length, 256).enc : "")
            + encodeHex(this)
            + "00".repeat((32 - (this.length - 1) % 32) - 1)
    }

    get headLen(): number {
        return 32
    }

    private _isDynamic: undefined | boolean
    get isDynamic(): boolean {
        return this._isDynamic ??= this.nominalLength === undefined
    }

}

const x = 1 // ints in each array
const y = 1 // arrays in tuple
const z = 1 // encode fn execution iterations

function foo<T, U>(
    [x, y]: [number, number],
    f: (a: number) => T,
    g: (as: Iterable<T>) => U
): ZipList<U> {
    return (q => new ZipList((function* () {
        while (true) yield g(q.take(x))
    })()).take(y))(new ZipList((function* () {
        let i = 0; while (true) yield f(i++)
    })()))
}

const _web3 = (() => {
    const tuple = [...foo([x, y], a => a, as => [...as])]
    const abi = [`(${Array(y).fill(`uint256[${x}]`)})`]
    const param = [tuple]
    const fn = () => web3Abi.encodeParameters(abi, param)
    const enc = fn().replace(/^0x/, "")
    return { fn, enc }
})()

const _ethers = (() => {
    const tuple = [...foo([x, y], a => a, as => [...as])]
    const types = [`tuple(${Array(y).fill(`uint256[${x}]`)})`]
    const values = [tuple]
    const encoder = new ethersAbi.AbiCoder()
    const encodeFn = encoder.encode.bind(encoder)
    const fn = () => encodeFn(types, values)
    const enc = fn().replace(/^0x/, "")
    return { fn, enc }
})()

const _viem = (() => {
    const tuple = [...foo([x, y], a => a, as => [...as])]
    const params = [{ type: "tuple", components: Array(y).fill({ type: `uint256[${x}]` }) }]
    const values = [tuple]
    const fn = () => viem.encodeAbiParameters(params, values)
    const enc = fn().replace(/^0x/, "")
    return { fn, enc }
})()

const _mod9 = (() => {
    const tuple = new _Tuple(...foo([x, y], a => new _Int(false, a, 256), as => new _Array(false, ...as)))
    const fn = () => tuple.enc
    const enc = fn()
    return { fn, enc }
})()

console.log([_web3, _ethers, _viem, _mod9])

assert(
    _web3.enc == _ethers.enc
    && _ethers.enc == _viem.enc
    && _viem.enc == _mod9.enc
)

Deno.bench('web3', () => {
    for (const _ of Array(z).fill(0)) _web3.fn()
})

Deno.bench('ethers', () => {
    for (const _ of Array(z).fill(0)) _ethers.fn()
})

Deno.bench('viem', () => {
    for (const _ of Array(z).fill(0)) _viem.fn()
})

Deno.bench('mod9', () => {
    for (const _ of Array(z).fill(0)) _mod9.fn()
})



// Deno.bench('web3 100x encode 3-string tuple', () => {
//     for (const _ of Array(100).fill(0)) web3Abi.encodeParameters(["tuple(string,string,string)"], [["foo", "bar", "baz"]])
// })

// Deno.bench('ethers 100x encode 3-string tuple', () => {
//     for (const _ of Array(100).fill(0)) new ethersAbi.AbiCoder().encode(["tuple(string,string,string)"], [["foo", "bar", "baz"]])
// })

// Deno.bench('viem 100x encode 3-string tuple', () => {
//     for (const _ of Array(100).fill(0)) viem.encodeAbiParameters([{ type: "tuple", components: [{ type: "string" }, { type: "string" }, { type: "string" }] }], [["foo", "bar", "baz"]])
// })

// Deno.bench('mod9 100x encode 3-string tuple', () => {
//     for (const _ of Array(100).fill(0)) new _Tuple(new _Tuple(new _String("foo"), new _String("bar"), new _String("baz"))).enc
// })

// console.log(new ethersAbi.AbiCoder().encode(["bool"], [true]))
// /* 0x0000000000000000000000000000000000000000000000000000000000000001 */

// console.log(new ethersAbi.AbiCoder().encode([], []))
// /* 0x */