// IntegerType

// we think a small VM state machine could be made here
// another idea for how to take string representation of numbers
//   and convert them to "real" numbers:
//   - recursively take chars from the string, counting each recurse in counter i
//   - have a lookup table for each char to its numeric value
//   - accumulator += lookup[char] * 10 ** i
// we also wonder if we can use a state cache to avoid recalculating
// we also wonder if it is possible for each number to have a unique symbol
//   so we can lookup the number in the cache for its type object representation
//   only calculate the number if it isn't in the cache
//   we wonder if we can calculate a number without needing to calculate
//   all the numbers before it
// if we want to go full VM, we can give it instructions like
//   "push", "pop", "add", "mul", etc.
// with instruction lists and a state,
//   we can build a "program", store it, load it, run it, etc.
// memory could be some ephemeral accumulator object
//   that only exists for one expression 

declare const _nat: unique symbol;
declare const s: unique symbol;

interface NatBase
{ readonly _nat: typeof _nat; }

interface Nat extends NatBase
{ value: [...typeof s[]] }

type MakeNat<T extends [...typeof s[]] = []>
= NatBase & { value: T }

// type AZero = MakeNat
// type AOne = MakeNat<[typeof s]>

type S<N extends Nat>
= NatBase & { value: [...N["value"], typeof s] }

// type BZero = MakeNat
// type BOne = S<BZero>

// type R<N extends NatBase & { value: [...typeof s[]] }>
// = N extends { value: [typeof s, ...infer Rest] }
//     ? NatBase & { value: Rest }
//     : never

type Add<Nats extends [Nat, Nat]>
= NatBase & { value: [...Nats[0]["value"], ...Nats[1]["value"]] }

// type CZero = MakeNat
// type COne = S<CZero>
// type CTwo = S<COne>
// type CThree = S<CTwo>
// type CFive = Add<[CTwo, CThree]>

type MulOps = "ZERO" | "SORT"
type Mul<Nats extends [Nat, Nat]>
= Nats[0][] & { length: Nats[1]["value"]["length"] }

type Double<T extends typeof s[]>
= [T, T]

type Halve<T>
= T extends Double<infer Q> ? Q : never

type DZeroA = MakeNat
type DOne = S<DZeroA>
type DTwo = S<DOne>
type DDoubleTwo = Double<DTwo["value"]>
type DHalveDoubleTwo = Halve<DDoubleTwo>
// type DFourFoo = MulFoo<DFour>
// type DThree = S<DTwo>
// type DFour = Mul<[DTwo, DThree]>
// type DFive = S<DFour>
    // A extends NatNonzero
    //     ? B extends NatNonzero
    //         ? B["value"] extends [typeof s]
    //             ? Add<A, Acc> // B is one, return A + Acc
    //             : Mul<A, R<B>, Add<A, Acc>> // B is > 1, add A to Acc and recurse with B - 1
    //         : NatZero // B is zero, return zero
    //     : NatZero // A is zero, return zero

type Zero = NatZero
type One = S<Zero> // value: [typeof s];
type Two = S<One> // value: [typeof s, typeof s];
type ZeroA = Mul<Zero, One> // type ZeroA = NatZero
type ZeroB = Mul<One, Zero> // type ZeroB = NatZero
type TwoA = Mul<One, Two> // value: [typeof s, typeof s];
type TwoB = Mul<Two, One> // value: [typeof s, typeof s];
type Four = Mul<Two, Two> // value: [typeof s, typeof s, typeof s, typeof s];
type Three = R<Four> // value: [typeof s, typeof s, typeof s];

// return string representation of a Nat
type Str<N extends Nat> =
    N extends NatNonzero
        ? `${N["value"]["length"]}`
        : "0"

// logical shift left value V by X bits
type Shl<V extends Nat, X extends Nat = S<NatZero>> =
    V extends NatNonzero
        ? X extends NatNonzero
            ? Shl<Add<V, V>, R<X>>
            : V
        : NatZero

/**
 * Generates a record type with keys of the form `${P}${I * X}` for X in [X, X-1, ..., 1]
 *
 * Note, can be optimized quite a bit, the object building is not very efficient
 * Ideas:
 *   - accumulate a union of single prop objects, then build the record at once with `keyof union`
 *   - accumulate a tuple of keys, then build the record at once with `tuple[number]`
 *   - accumulate a union of keys, then build the record at once with `keyof union`
 *
 * @param P - Prefix for the keys
 * @param I - Initial value for multiplication
 * @param T - Type of the values in the record
 * @param X - Number of keys to generate (default: 32)
 * @param Acc - Accumulator for recursive calls (internal use)
 */
type CreateNumericRecord<
    P extends string, // prefix string literal
    I extends NatNonzero, // initial value
    T extends unknown, // value type
    X extends Nat = Shl<Shl<Shl<Shl<Shl<S<NatZero>>>>>>, // repeat X times
    Acc extends Record<string, T> = Record<never, never> // accumulator
> =
    X extends NatNonzero
        ? CreateNumericRecord<P, I, T, R<X>, { [K in keyof Acc | `${P}${Str<Mul<X, I>>}`]: T }> 
        : Acc // X is zero, return Acc

// type BytesM = CreateNumericRecord<"bytes", S<NatZero>, undefined> // { bytes1: undefined, bytes2: undefined, ..., bytes32: undefined }
type intM = CreateNumericRecord<"int", Shl<Shl<Shl<S<NatZero>>>>, Integer>  // { int8: undefined, int16: undefined, ..., int256: undefined }
type uintM = { [K in keyof intM as `u${K}`]: Integer }  // { uint8: undefined, uin16: undefined, ..., uint256: undefined }



// type Options = {
//     numBits: number,
//     isSigned: boolean
// }


// interface FooInteger extends intM {}
// class FooInteger {

    // static {
    //     for (let i = 8; i <= 256; i += 8) {
    //         for (const isSigned of [true, false]) {  
    //             Object.assign(this.prototype, (() => {
    //                 const key = `${!isSigned ? "u" : ""}int${i}`;
    //                 return {
    //                     [key]: () => {
    //                         const instance = FooInteger.cache.get(i)?.get(isSigned);
    //                         if (instance) return instance
    //                         const integer = new FooInteger({ numBits: i, isSigned });
    //                         FooInteger.cache.set(i, new Map([[isSigned, integer]]));
    //                         return integer;
    //                     }
    //                 }
    //             }))
    //         }
    //     }
    // }

    // private readonly numBits: number;
    // private readonly isSigned: boolean;
    // private static readonly cache: Map<number, Map<boolean, FooInteger>> = new Map();

//     private constructor(options: Options) {
//         this.numBits = options.numBits;
//         this.isSigned = options.isSigned;
//     }

//     min(): bigint {
//         return this.isSigned
//             ? -(2n ** BigInt(this.numBits - 1))
//             : 0n;
//     }
    
//     max(): bigint {
//         return this.isSigned
//             ? 2n ** BigInt(this.numBits - 1) - 1n
//             : 2n ** BigInt(this.numBits) - 1n;
//     }

//     private static create(options: Options): FooInteger {
//         return new FooInteger(options);
//     }

// }


// interface Options {
//     numBits: number,
//     isSigned: boolean
// }
// interface Instance {
//     min: bigint
//     max: bigint
// }
// interface Static extends intM, uintM {}
// const Integer: Static = new Proxy(
//     class implements Instance {

//         readonly #numBits: number;
//         readonly #isSigned: boolean;

//         private constructor(options: Options) {
//             this.numBits = options.numBits;
//             this.isSigned = options.isSigned;
//         }

//         min(): bigint {
//             return this.isSigned
//                 ? -(2n ** BigInt(this.numBits - 1))
//                 : 0n;
//         }

//         max(): bigint {
//             return this.isSigned
//                 ? 2n ** BigInt(this.numBits - 1) - 1n
//                 : 2n ** BigInt(this.numBits) - 1n;
//         }

//     },
//     {
//         get(target, prop) {
//             if (typeof prop == "symbol") return undefined;
//             const match = prop.match(/^(u)?int(\d+)$/);
//             if (!match) return undefined;
//             const [u, d] = match
//             const isSigned = !u
//             const numBits = parseInt(d);
//             const options: Options = { numBits, isSigned };
//             return new target(options)
//         }
//     }
// )

// class SolLibAstType extends Set {
//     has() { return false }
// }

// declare const foo: Foo

// class Integer {

//     readonly numBits: number;
//     readonly isSigned: boolean;

//     constructor(options: Options) {
//         const { numBits, isSigned } = options;

//         if (numBits <= 0 || numBits > 256 || numBits % 8 != 0) {
//             throw new Error(`invalid numBits ${numBits}`);
//         }

//         this.numBits = numBits;
//         this.isSigned = isSigned;
//     }

//     getVariability(): TypeVariability {
//         return TypeVariability.static;
//     }

//     min(): bigint {
//         return this.isSigned
//             ? -(2n ** BigInt(this.numBits - 1))
//             : 0n;
//     }

//     max(): bigint {
//         return this.isSigned
//             ? 2n ** BigInt(this.numBits - 1) - 1n
//             : 2n ** BigInt(this.numBits) - 1n;
//     }
    
//     toTypedValue(value: unknown): TypedValue<bigint, IntegerType> {
//         let n: bigint;

//         if (typeof value == "bigint") {
//             n = value;
//         } else if (typeof value == "number" && Number.isInteger(value)) {
//             n = BigInt(value);
//         } else {
//             throw new Error(`expected integer, got ${value}`);
//         }

//         if (n < this.min() || n > this.max()) {
//             throw new Error(`value out of range`);
//         }
        
//         return { value: n, type: this };
//     }

// }