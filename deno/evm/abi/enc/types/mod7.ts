const phantom = <T>(_: never): T => <T>undefined
type ExtractPhantom<T> = T extends typeof phantom<infer R> ? R : never
type Brand = readonly string[]

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
// (NOTE) 



type Foo<B extends Brand> = B & ((this: B) => unknown)

type Bar<F, P extends string[]> = F extends () => { [K in P[0]]: infer I }
    ? I
    : never

const brand0 = ["foo"] as const
const BigInt = Object.assign(
    function (this: typeof brand0) {
        return {
            p0: phantom<bigint>,
            p1: 5,
            p2: (_: never) => <Bar<typeof Integer, ["p0"]>><unknown>undefined
        }
    },
    brand0
) satisfies Foo<typeof brand0>

const brand3 = ["boo"] as const
const Uint8Array = Object.assign(
    function (this: typeof brand3) {
        return {
            type: phantom<Uint8Array>
        }
    },
    brand3
) satisfies Foo<typeof brand3>

const brand1 = ["bar"] as const
const Integer = Object.assign(
    function (this: typeof brand1) {

        const brand2 = [...typeof brand1, "baz"] as const
        const Inner = Object.assign(
            function (this: typeof brand2) {
                return {
                    p0: phantom<{ type: typeof brand2, value: Uint8Array }>,
                    p1: (_: never) => <ExtractPhantom<Bar<typeof Uint8Array, ["type"]>>><unknown>undefined
                }
            },
            brand2
        ) satisfies Foo<typeof brand2>

        return {
            p0: phantom<boolean>,
            p1: "hello",
            p2: (_: never) => <ExtractPhantom<Bar<typeof BigInt, ["p0"]>>><unknown>undefined,
            Inner
        }
    },
    brand1
) satisfies Foo<typeof brand1>

type Baz = Bar<typeof BigInt, ["p1"]>

declare const someFazType: ExtractPhantom<Bar<Bar<typeof Integer, ["Inner"]>, ["p1"]>>