// (DONE) we want to create a brand object
// (DONE) then create a function intersected with that object
//   and whose this is assigned to that object
// (DONE) we then want to create a function that "extends" the previous function/object
//   by appending a new string to the _brand property of the brand object
// (DONE) make one of the functions return a phantom
// (DONE) make both functions return an object with
//   some type phantom
//   a value
//   and a phantom of the other function's object's phantom
// (NOTE) for the above we had to use functions to avoid circular references
//   we're not sure why that worked, especially because the phantoms are also functions
// (DONE) now declare a const that has the extracted phantom of one function's return
//   via the other function's return
// (DONE) satisfies constraint makes sure function's this and mixed object are the same
// (DONE) make a type that takes a Foo and a string[]
//   then returns the Foo if the first element of the string[] matches the Foo's _brand (array first element)
//   we think for recursive implementation we'll want to increment an index
// (DONE) perhaps our type taking a Foo and a string[] should start inside the Foo, rather than outside
// (DONE) add an option to extract phantom so that if it's not a phantom we just return the parameter rather than never
// (DONE) create a Foo inside of one of the existing Foos, whose brand is an extension of the existing Foo
//   and whose phantom is another new Foo for Uint8Array
// (NOTE) we removed the option for phantom extraction and Bar no longer extracts by default
// let's make a new type for the recursive pattern that appears: ExtractPhantom<Bar<Bar<...>>>
//   (DONE) first, let's see if we can modify Bar to work with a string[]
//   (DONE) then, let's see if we can modify Bar to work with an index
//   (DONE) Tail is either a ["", ...] or [] and we want to turn it respectively into G or never
//     [G, ...never[]][Tail["length"]] -- this is disgusting but it seems to work
// (DONE) let's tuple or curry the parameters to Bar. commas in instantiation expressions seem to break the language server
//   actually, since Baz is just recursive Bar which already uses tuples, just use Baz instead
// (DONE) we should make a function to help produced these objects to reduce a lot of the boilerplate
//   holy fuck that reduced a lot of boilerplate. nice!
// alright, we want to encode a bool



// function that returns undefined but takes a generic type and asserts it returns that type
// also has a never-typed parameter to prevent it from being called, preventing the assertion from becoming real (we hope)
const phantom = <T>(_: never): T => <T>undefined

// extract the return type of a phantom
type ExtractPhantom<T> = T extends (_: never) => infer R ? R : never

// its purpose is representing a logical identifier via an array of strings
type Brand = readonly string[]

// the intersection of a brand and a function whose `this` is the brand
// setting `this` to the brand allows the function to propagate the brand
type Foo<B extends Brand> = B & ((this: B) => unknown)

// takes a Foo F and a string P
// assumes the Foo returns an object with a property P
// returns the type of that property
// if the property is not found, returns never
type Bar<F, P extends string> = F extends () => { [K in P]: infer I }
    ? I
    : never

// like Bar, but can work with an array of strings
// to "descend" a recursive structure of object-returning Foos
// we're not sure if our strange incantations here are effecient or foolish
// we wonder if we can make another type that takes the parameters more "normally"
// then wraps them in a tuple and passes it to this one
// our hunch is that we incur a lower instantiation depth this way
type Baz<
    T extends [unknown, string[]],
    Z = never
>
= T extends [
    () => { [K in T[1][0]]: infer G },
    [
        infer _,
        ...infer Tail extends string[]
    ]
]
    ? Baz<
        [G, Tail],
        [G, ...never[]][Tail["length"]]
    >
    : Z

// create a brand, then a Foo with that brand, `satisfies` check makes sure it's correctly formed
// one of this Foo's properties is a phantom that comes from another Foo's return
// it seems that if any of that Foo's properties can be directly traced to this Foo
// we must "indirect" one or probably preferably both with a function call
// we're not sure why that works, especially since the phantoms are also functions
// but this most likely has to do with the type system's handling of circular references and functions

// const brand0 = ["foo"] as const
// const BigInt = Object.assign(
//     function (this: typeof brand0) {
//         return {
//             p0: phantom<bigint>,
//             p1: 5,
//             p2: () => phantom<Baz<[typeof Integer, ["p0"]]>>
//         }
//     },
//     brand0
// ) satisfies Foo<typeof brand0>

function makeFoo<
    const B extends Brand,
    const R
>(b: B, r/**eturn**/: R) {
    return Object.assign((function () { return r }).bind(b), b)
}

const BigIntType = makeFoo(["JavaScript", "Type", "BigInt"], phantom<bigint>)


// another brand and simple Foo
// one can imagine this as a "JavaScript.Uint8Array" type in Foo form
const brand3 = ["boo"] as const
const Uint8Array = Object.assign(
    (function (this: typeof brand3) {
        return {
            type: phantom<Uint8Array>
        }
    }).bind(brand3),
    brand3
) satisfies Foo<typeof brand3>

// a Foo with an "inner" Foo, demonstrating a recursive structure of Foos
// we'll need to more automatically propagate the brand, which should be doable with .bind
const brand1 = ["bar"] as const
const Integer = Object.assign(
    function (this: typeof brand1) {

        const brand2 = [...typeof brand1, "baz"] as const
        const Inner = Object.assign(
            function (this: typeof brand2) {
                return {
                    p0: phantom<{ type: typeof brand2, value: Uint8Array }>,
                    p1: () => phantom<ExtractPhantom<Baz<[typeof Uint8Array, ["type"]]>>>
                }
            },
            brand2
        ) satisfies Foo<typeof brand2>

        return {
            p0: phantom<boolean>,
            p1: "hello",
            p2: () => phantom<ExtractPhantom<Baz<[typeof BigInt, ["p0"]]>>>,
            Inner
        }
    },
    brand1
) satisfies Foo<typeof brand1>

// use Baz to extract the type of a nested Foo property which is a sort of "phantom pointer" to a phantom in a different Foo
type BazTestA = Baz<[typeof Integer, ["Inner", "p0"]]>
// type BazTestA = (_: never) => {
//     type: readonly [...string[], "baz"];
//     value: Uint8Array;
// }


// same as the above, but with two nested Bar calls instead of one Baz, demonstrates how Baz can recurse
type BazTestB = Bar<Bar<typeof Integer, "Inner">, "p0">
// type BazTestB = (_: never) => {
//     type: readonly [...string[], "baz"];
//     value: Uint8Array;
// }

// a type that extracts the type of a real property from a returned Foo object
type BigIntP1Type = Bar<typeof BigInt, "p1">
// type BigIntP1Type = number


// successfully extract the type from a phantom pointer in a nested Foo that points towards a "foreign" Foo
declare const integerInnerP1Var: ExtractPhantom<ExtractPhantom<Baz<[typeof Integer, ["Inner", "p1"]]>>>
// const integerInnerP1Var: Uint8Array

const Solidity = makeFoo(["Solidity"], {
    bool: makeFoo(["bool"], (() => {
        const brand = ["Solidity", "bool"] as const
        const p = phantom<boolean>
        const type = { brand, phantom: p }
        const to = {
            JavaScript: <X extends ReturnType<typeof from.JavaScript>>(x: X): X["value"] => x.value
        }
        const from = {
            JavaScript: <X extends boolean>(x: X) => ({ ...type, value: x })
        }
        return Object.assign(from.JavaScript, { type, from, to })
    }))(),
})

// give Sol or Bool some "from", "to" default options
// so we can instantiate these and use them more conveniently
const Sol = Solidity()
const Bool = Sol.bool()

const solBoolVar = Bool(true)
const jsBoolVar = Bool.to.JavaScript(solBoolVar)