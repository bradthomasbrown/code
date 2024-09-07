import { repeat } from '../../../../stdplus/fp/lib/repeat.ts'



// type ConversionRule<
//     ST,
//     SV,
//     TT,
//     TV
// > = Readonly<{
//     st: ST
//     tt: TT
//     validate?: (sv: SV) => boolean
//     convert: (sv: SV) => TypedValue<TT, TV>
// }>

// // deno-lint-ignore no-namespace
// namespace JavaScript {
//     // deno-lint-ignore no-namespace
//     export namespace Number {
//         export const identifier = Symbol("JavaScript.Number")
//         export type TypedValue = TypedValue_<typeof identifier, number>
//     }
// }

// type MakeTypedValue<T, V> = { [K in keyof TypedValue<T, V>]: TypedValue<T, V>[K] }

// what's really unique here?
// - SolLibAst
// - Integer
// - bigint
// namespace SolLibAst {
//     export namespace Integer {
//         export const identifier = Symbol("SolLibAst.Integer")
//         export type TypedValue = MakeTypedValue<typeof identifier, bigint>
//     }
// }

// namespace GenericNamespace {
//     export namespace Integer {
//         export const identifier = Symbol("SolLibAst.Integer")
//         export type TypedValue = MakeTypedValue<typeof identifier, bigint>
//     }
// }

// namespace SolLibAst2 {
//     export namespace Integer {
//         export type TypedValue = MakeTypedValue<typeof identifier, bigint>
//         export interface Foog {
//             fooga: number
//         }
//         export function goof() {
//             interface Foog {
//                 fooga: string
//             }
//         }
//         export const identifier = Symbol("SolLibAst.Integer")
//     }
// }

// type Foop = SolLibAst2







// // Base type for our dynamic type accumulator
// type TypeAccumulator<T = {}> = {
//   readonly __types: T;
// };

// // Namespace for our type accumulator
// namespace DynamicTypes {
//   export type Accumulate<
//     Acc extends TypeAccumulator,
//     K extends string,
//     V
//   > = TypeAccumulator<Acc['__types'] & { [P in K]: V }>;

//   export type Get<
//     Acc extends TypeAccumulator,
//     K extends keyof Acc['__types']
//   > = Acc['__types'][K];

//   // Helper type to create a TypedValue
//   export type MakeTypedValue<T extends symbol, V> = { readonly __type: T; readonly value: V };

//   // Helper to create a new type in our accumulator
//   export type AddType<
//     Acc extends TypeAccumulator,
//     K extends string,
//     V
//   > = Accumulate<Acc, K, MakeTypedValue<symbol, V>>;
// }

// type Brand<V, Brand extends readonly string[]>
// = { _brand: Brand, value: V }

// type SerializablePrimitive =
//     | null
//     | undefined
//     | boolean
//     | number
//     | bigint
//     | string

// type TypedArray =
//     | Int8Array | Uint8Array | Uint8ClampedArray
//     | Int16Array | Uint16Array
//     | Int32Array | Uint32Array
//     | Float16Array | Float32Array | Float64Array
//     | BigInt64Array | BigUint64Array

// type Serializable =
//     | SerializablePrimitive
//     | ArrayBuffer
//     | DataView
//     | TypedArray
//     | Array<Serializable>
//     | Map<Serializable, Serializable>
//     | Set<Serializable>
//     | { [K: Extract<PropertyKey, Serializable>]: Serializable }



// type Uncallable<T> = (_: never) => T

// const voidFn = () => undefined

const phantom = <T>(_: never): T => <T>undefined

type ExtractPhantom<T> = T extends typeof phantom<infer R> ? R : never

// const neverFn = (..._: unknown[]): never => { throw new Error("neverFn called") }

// interface Goo {
//     type: typeof uncallableVoidFn
//     from?: Set<typeof uncallableVoidFn>
//     to?: Set<typeof uncallableVoidFn>
// }

// interface Boo {
//     [Type: string]: Goo
// }

// function ffoo<A>(_: A): A {
//     return _
// }

// const vfoo = ffoo({
//     Number: {
//         type: uncallableVoidFn<number>,
//         to: new Set([
//             SolLibAst.Integer.type
//         ])
//     }
// })

// const JavaScript = {
//     Number: {
//         type: uncallableVoidFn<number>,
//         to: new Set([
//             SolLibAst.Integer.type
//         ])
//     }
// }

// function JavaScript() {
//     let _
//     return _ ?? (_ = {
//         Number: {
//             type: uncallableVoidFn<number>,
//             to: new Set([
//                 SolLibAst().Integer.type
//             ])
//         }
//     })
// }


type Brand = readonly string[]

// const JavaScript = brandBoundFn(
//     ["JavaScript"] as const,
//     function <B extends Brand>(this: B) {



//         const BigInt = ((function <B extends readonly string[]>(this: { brand: B } | void) {
//             const brand = [...<B>(this?.brand ?? []), "BigInt"] as const

//             const type = uvf<bigint>

//             const to = () => SolLibAst().Integer().brand

//             return { brand, type, to }
//         })<typeof brand>).bind({ brand })
        


//         return { brand, BigInt }
//     }

// const SolLibAst = function <B extends readonly string[]>(this: { brand: B } | void) {
//     const brand = [...<B>(this?.brand ?? []), "SolLibAst"] as const



//     const Integer = ((function <B extends readonly string[]>(this: { brand: B } | void) {
//         const brand = [...<B>(this?.brand ?? []), "Integer"] as const

//         const type = uvf<Brand<bigint, typeof brand>>

//         const from = () => JavaScript().BigInt().brand

//         return { brand, type, from }
//     })<typeof brand>).bind({ brand })
    


//     return { brand, Integer }
// }

// // const foofn = (function() { return "boo" as const }).bind({ brand: ["foo"] as const })

// type TBrandedFunction<
//     B extends readonly unknown[] = readonly unknown[],
//     A extends unknown[] = unknown[],
//     R = unknown
// > = { _brand: B } & ((this: { _brand: B }, ...args: A[]) => R)

// interface IBrandedFunction<
//     B extends Brand = Brand,
//     A extends unknown[] = unknown[],
//     R extends unknown = unknown
// >
// {
//     _brand: B
//     (this: { _brand: B }, ...args: A[]): R
// }

// type ExtendBrand
// <
//     E extends Brand,
//     F extends IBrandedFunction<Brand, unknown[], unknown>
// >
// = F extends IBrandedFunction<infer B, infer A, infer R>
//     ? IBrandedFunction<[...B, ...E], A, R>
//     : never

// function brandFunction
// <
//     B extends Brand,
//     F extends IBrandedFunction<Brand, unknown[], unknown>
// >
// (b: B, f: F)
// : IBrandedFunction<B, Parameters<F>, ReturnType<F>>
// {
//     const brand = { _brand: b }
//     return Object.assign(
//         (function() {
//             return "baz" as const
//         }).bind({ _brand: ["foo"] as const }),
//         { _brand: ["foo"] as const }
//     )
// }

// const foob = uvf.bind()

// const foo = Object.assign(
//     (function<B extends Brand>(this: { _brand: B }) {
//         return "baz" as const
//     }).bind({ _brand: ["foo"] as const }),
//     { _brand: ["foo"] as const }
// )

// declare const bar: ExtendBrand<["bar"], typeof foo>

// function fooFn<
//     B extends readonly string[],
//     F extends () => unknown
// > (b: B, f: F): Tfnfoo<B, F> {
//     return <Tfnfoo<B, F>>f.bind(b)
// }


const Systems = brandBoundFn(
    ["Systems"] as const,
    function<B extends Brand>(this: B) {
        return JavaScript
    }
)

const Systems2 = Object.assign(
    function() { return "baz" as const },
    { _brand: ["bar"] as const }
)

// const Systems = (function <B extends readonly string[]>(this: { brand: B }) {

//     const systems = [
//         JavaScript,
//         SolLibAst
//     ] as const

//     return [
//         JavaScript,
//         SolLibAst
//     ].reduce((p, c) => Object.assign(p, { [c.name]: null }), {})

// }).bind({ brand: ["Systems"] as const })

// console.log(Systems())

// type ReturnTypeWithTail<
//     T extends [
//         (this: { brand: readonly string[] } | void) => unknown,
//         string[]
//     ]
// > = true

// type Decide<T> =
//     true

// type GetResult<T> =
//     unknown

// type Foo<
//     X extends () => unknown,
//     Y extends string,
//     Z extends "go" | "stop" = "go",
//     R = never
// > =
//     Z extends "stop"
//         ? R
//         : Foo<
//             ReturnType$Tail<[X, Y]>[0],
//             ReturnType$Tail<[X, Y]>[1],
//             Decide<ReturnType$Tail<[X, Y]>>,
//             GetResult<ReturnType$Tail<[X, Y]>>
//         >



type Fooa = ReturnTypeWithTail<[typeof Systems, ["Systems"]]>

// const foo = uncallableVoidFn<number>
// type Foo = ReturnType<typeof foo>
// type Bar<X extends Uncallable<unknown>> = X extends Uncallable<infer R> ? R : never
// type ExtractSetType<T extends Set<unknown>> = T extends Set<infer R> ? R : never
// type Baz = Bar<ExtractSetType<typeof SolLibAst.Integer.from>>



// function toSolLibAstIntegerFromX(x: Bar<ExtractSetType<typeof SolLibAst.Integer.from>>): Bar<typeof SolLibAst.Integer.type> {

//     const _brand = "_SolLibAst.Integer"
//     const y: Bar<typeof SolLibAst.Integer.type> = { _brand, value: 0n }

//     if (typeof x == "object") {
//         let _: never
//         switch (x._brand) {
//         case "_FakeSystemA.FakeType": y.value = 0n; break
//         case "_FakeSystemB.FakeType": y.value = 1n; break
//         case "_FakeSystemC.FakeType": y.value = 2n; break
//         default: _ = x
//         }
//     } else {
//         x
//     }

// 	return y
// }

// function fromJavascriptNumberToY(x: Bar<typeof JavaScript.Number.type>): 





// const afoo = mkAfoo([
//     bfoo,
//     abar
// ])

// type Bars = Foos<["foo", "bar"]>

// // Usage example
// namespace SolLibAst {
//     export type Types = ToTypedValues<{
//         Integer: bigint,
//         String: string,
//         Boolean: boolean
//     }>
// }

// type WithInteger = DynamicTypes.AddType<SolLibAst, 'Integer', bigint>;
// type WithString = DynamicTypes.AddType<WithInteger, 'String', string>;
// type WithBoolean = DynamicTypes.AddType<WithString, 'Boolean', boolean>;

// // Accessing the types
// type IntegerTypedValue = DynamicTypes.Get<WithBoolean, 'Integer'>;
// type StringTypedValue = DynamicTypes.Get<WithBoolean, 'String'>;
// type BooleanTypedValue = DynamicTypes.Get<WithBoolean, 'Boolean'>;

// // Type tests
// const testInteger: IntegerTypedValue = { __type: Symbol(), value: BigInt(42) };
// const testString: StringTypedValue = { __type: Symbol(), value: "Hello" };
// const testBoolean: BooleanTypedValue = { __type: Symbol(), value: true };

// // This would cause a type error:
// // const errorTest: IntegerTypedValue = { __type: Symbol(), value: "Not a bigint" };










// // declare const boo: typeof Foo

// const identifier = Symbol("JavaScript.Number")



// const bara = Foo.getData(Symbol("JavaScript.Number"))
// type Bar = {
//     JavaScript: {
//         Number: TypedValue<typeof identifier, number>
//     },
//     SolLibAst: {
//         Integer: bigint
//     }
// }



// const boo = Foo.baz(4).bar
// console.log({ boo })

// const boo = Foo.bar // const boo: 3
// const far = Foo.Baz // Property 'Baz' does not exist on type 'typeof Foo'
// type Faz = Foo.bar // 'Foo.bar' refers to a value, but is being used as a type here. Did you mean 'typeof Foo.bar'?
// type Goo = Foo.Baz // type Goo = boolean

// const goof = (): typeof gooa => {
//     const gooa = Symbol("gooa")
//     return gooa
// }

// const fooh = <N>() => {
//     interface Fooi {
//         name: N
//     }
//     const _types = <Fooi><unknown>undefined
//     return Object.assign(Symbol("fooh"), { _types })
// }

// const fooha = fooh<"hello">()
// declare const foohb: typeof fooha

// type Lens<T, U> = {
//   get: (obj: T) => U;
//   set: (val: U, obj: T) => T;
// };

// type ArrayLens = {
//     get: <V>(obj: V[]) => V;
//     set: <V>(val: V, obj: V[]) => V[];
// }

// const arraylens: ArrayLens = {
//     get: (arr) => arr[0],
//     set: (val, arr) => [val, ...arr.slice(1)],
// }

// const numberArrayLens: Lens<number[], number> = arraylens;
// const stringArrayLens: Lens<string[], string> = arraylens;
// const neverArrayLens : Lens<never[], never> = arraylens;
// const unknownArrayLens : Lens<unknown[], unknown> = arraylens;

// numberArrayLens.get([1, 2, 3]);
// numberArrayLens.set(0, [1, 2, 3]);
// stringArrayLens.get(["1", "2", "3"]);
// stringArrayLens.set("0", ["1", "2", "3"]);


// type Foo = SolLibAst.Integer["type"]

// type Foo<S> = {
//     bar(): { baz: S }
// }

// const boo = Symbol("baz")

// const foo
// : Foo<typeof boo>
// = Object.freeze({
//     bar() { return { baz: boo } }
// })

// const rule
// : ConversionRule<
//     typeof JavaScript.number,
//     number,
//     typeof SolLibAst.integer,
//     bigint
// > = Object.freeze({
//     st: JavaScript.number,
//     tt: SolLibAst.integer,
//     convert(sv) {

//         const type
//         : typeof SolLibAst.integer
//         = SolLibAst.integer

//         const value = BigInt(sv + 1)

//         const ttv
//         : TypedValue<
//             typeof SolLibAst.integer,
//             bigint
//         >
//         = { type, value }
        
//         return ttv
//     }
// })

// class Converter {

//     convert<R extends ConversionRule>(
//         sv: Parameters<R["convert"]>[0],
//         cr: R
//     ): ReturnType<R["convert"]> {

//         if (!(cr.validate?.(sv) ?? true)) {
//             throw new Error(`Validation failed for value ${sv} in conversion from type ${cr.st.description} to type ${cr.tt.description}`)
//         }

//         const tv = cr.convert(sv)

//         return {
//             value: tv,
//             type: tt
//         }
//     }
// }