// type Lens<T, U> = {
//     get(obj: T): U
//     set(val: U, obj: T): T
// }

// no way to express the following type signature
// const firstItemInArrayLens: ArrayIndexLens = {
//     get: arr => arr[0],
//     set: (val, arr) => [val, ...arr.slice(1)]
// }

// type ArrayIndexLens = {
//     get<A>(obj: A[]): A
//     set<A>(val: A, obj: A[]): A[]
// }

// firstItemInArrayLens.get([10])      // Should be number
// firstItemInArrayLens.get(["Hello"]) // Should be string

// in haskell, one could write:
//   {-# LANGUAGE ExplicitForAll #-}
//   data Lens s a = Lens { get :: s -> a, set :: a -> s -> s }
//   firstItemInArrayLens :: forall a. Lens [a] a
//   firstItemInArrayLens = Lens { get = _, set = _ }

// ###

// type FirstItemInArrayLens = <A>() => Lens<A[], A>
// const firstItemInArrayLens: FirstItemInArrayLens = <A>() => {
//     return {
//         get: arr => arr[0],
//         set: (val, arr) => [val, ...arr.slice(1)]
//     }
// }

// // only infers number if we explicitly specify that
// // ideally, we'd like to infer number without having to specify it
// firstItemInArrayLens<number>().get([10])

// ### lets start with the simpler example

// // This works
// type Id = <T>(x : T) => T

// // This should also work
// type IdT<T> = (x: T) => T
// type Id = <T> IdT<T> // but is impossible to express

// ### actully, even simpler, a function is fairly complex

// ### even simpler step, a literal value

const phantom = <T>(_: never): T => <T>undefined

type ExtractPhantom<T> = T extends (_: never) => infer R ? R : never

type Brand = readonly string[]

type Foo<B extends Brand, R = unknown> = B & ((this: B) => R)

type ExtractFooReturn<T extends unknown> = T extends Foo<Brand, infer R> ? R : never

// we can simplify this
// type FooReturnAccess<T extends [unknown, string]> = T extends [() => { [K in T[1]]: infer I }, string]
//     ? I
//     : never

const ThreeTypeBrand = ["type", "3"] as const
const ThreeType = Object.assign(
    (function (this: typeof ThreeTypeBrand) {
        return phantom<() => 3>
    }).bind(ThreeTypeBrand),
    ThreeTypeBrand
) satisfies Foo<typeof ThreeTypeBrand>

const _three
: ReturnType<ExtractPhantom<ExtractFooReturn<typeof ThreeType>>>
= 3
// const three: 3

// ### alright, now do a Number type

const NumberTypeBrand = ["type", "number"] as const
const NumberType = Object.assign(
    (function (this: typeof NumberTypeBrand) {
        return phantom<() => number>
    }).bind(NumberTypeBrand),
    NumberTypeBrand
) satisfies Foo<typeof NumberTypeBrand>

const _number7
: ReturnType<ExtractPhantom<ExtractFooReturn<typeof NumberType>>>
= 7
// const number7: number

const _number13
: ReturnType<ExtractPhantom<ExtractFooReturn<typeof NumberType>>>
= 13
// const number13: number

// ### alright, what's next?
// ### https://wiki.haskell.org/Constructor
// ### we can think of the previous types as type constructors with zero arguments, or nullary type constructors
// ### we've changed 'representation' to 'constructor' to better reflect this
// ### we may also want to change the phantoms to be functions, with nullaries having 0 arguments
// ### we may also want to return the phantom directly, rather than an object with a phantom property
// ### https://wiki.haskell.org/Smart_constructors
// ### "using phantom types and Peano numbers" hey what the fuck
// ### https://nikita-volkov.github.io/refined/
// ### https://en.wikipedia.org/wiki/Generalized_algebraic_data_type
// ### https://github.com/Microsoft/TypeScript/issues/4895
// ### it seems our use of an unary function with a never parameter is fairly clever.
//   people seem to struggle with making the types "not real"
// ### https://en.wikipedia.org/wiki/Type_constructor
// ### "a single non-basic type constructor—the function type constructor"
// ### aha, that's where we are: we realized that functions seem to be the "primordial thing"
// ### https://en.wikipedia.org/wiki/Lambda_calculus

// ### when we said a function was fairly complex, we were correct
// ### https://en.wikipedia.org/wiki/Lambda_calculus
// ### - x: A variable is a character or string representing a parameter.
// ### - (λx.M): A lambda abstraction is a function definition,
//   taking as input the bound variable x (between the λ and the punctum/dot .)
//   and returning the body M
// ### - (M N): An application, applying a function M to an argument M. Both M and N are lambda terms.
// ### https://en.wikipedia.org/wiki/De_Bruijn_index
// ### don't name the variables, but instead
//   "Each de Bruijn index is a natural number that represents an occurrence of a variable in a λ-term,
//   and denotes the number of binders that are in scope between that occurrence and its corresponding binder"
// ### https://dl.acm.org/doi/pdf/10.1145/582153.582176
// ### https://www.haskell.org/onlinereport/decls.html

// ### we need to reorient. what are we trying to do?
// ### we made these structures to represents logically grouped _things_,
//   where things could be anything, data, types, functions, phantom types, groups of these, etc.
// ### we think that doing this will make it easier to transform between _things_
//   from one system to another, like from TypeScript to ABI encoded solidity
//   or a potential intermediate SolLibAST type
// ### we get the idea that if we can represent basically anything,
//   then we should be able to solve most if not all problems in Typescript.
// ### so we wanted to solve a problem, #17574 -- Generic values.
// ### the problem with this issue is that the author didn't really provide a clear example of any "problem".
// ### what they did provide was "i wrote this pseudocode and it doesn't work and i want it to work",
//   along with subjectivities like "[the] features interact poorly",
//   or trivialities like "this prevents us from modeling polymorphic lenses, but here's a two line workaround that takes 1 second to implement".
// ### the summary of their "issue" appears to be "i can write like this in haskell or like that in typescript and writing like that takes one second longer".
// ### they don't even provide a complete solution using their workaround so we can see what the real difference is.
// ### author even calls it a "proposal". hahaha

// ### https://github.com/microsoft/TypeScript/issues/17574#issuecomment-337732266
// ### this is the first person who came in with "I found another use for this".
// ### to summarize "I can't succinctly type it", except they did, and it's 40 extra characters.
//   I'd call that succinct.
// ### we also know from poking around that issue that it and related issues get wildly derailed
//   because the people who open the issues don't even seem to understand what they want. lots of
//   "i want this. oh i was wrong, i want this. oh i was wrong, i want this. oh, this workaround works. oh, no it doesn't. oh, i want this".
//   :^)
// ### then some people bitching at each other for no apparent reason, derailing the issue further

type IsNumberLiteral<T extends number> = number extends T ? never : T

const NumberLiteralTypeBrand = ["type", "numberliteral"] as const
const NumberLiteralType = Object.assign(
    (function (this: typeof NumberLiteralTypeBrand) {
        return phantom<<const Z>(z: Z) => Z>
    }).bind(NumberLiteralTypeBrand),
    NumberLiteralTypeBrand
) satisfies Foo<typeof NumberLiteralTypeBrand>

type NumLitPhant = ExtractFooReturn<typeof NumberLiteralType>
type NumLitVal = ExtractPhantom<NumLitPhant>