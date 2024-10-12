// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
// for of, array and param spread, yield*, and array destructuring all expect an iterable
// for await of and yield* are the only ways to interact with async iterables
// there is a definition for a well formed iterable (we can use to make a type guard)

function assert(predicate: unknown, msg?: string): asserts predicate {
    if (!predicate) throw new Error(`AssertionError: ${msg}`)
}

class Blazer<T = unknown> extends Map<T, Blazer<T>> {

    value: undefined | symbol

    blaze(key: T[], description?: string, index: number = 0): symbol {
        if (index >= key.length) return this.value ??= Symbol(description)

        const symbol = this.getSetRet(key[index]!).blaze(key, description, index + 1)
        if (!this._keys.has(symbol) && !index) this._keys.set(symbol, key)
        return symbol
    }
    
    toKey(symbol: symbol): undefined | T[] {
        return this._keys.get(symbol)
    }

    private _keys: Map<symbol, T[]> = new Map()

    private setRet(p: T): Blazer<T> {
        return (r => (this.set(p, r), r))(new Blazer<T>)
    }

    private getSetRet(p: T): Blazer<T> {
        return this.get(p) ?? this.setRet(p)
    }

}

function* debruijn(A: Set<symbol>, n: number) {
    const k = A.size // alphabet size
    assert(k, "alphabet cannot be empty")
    assert(n, "n cannot be zero")
    const s: symbol[] = [] // "string" in S
    const S = new Set<symbol>() // set of "words"
    const B: symbol[] = [] // debruijn sequence
    const W = new Blazer<symbol>() // maps "string" to "word"
    let a: undefined | symbol
    for (const _a of A) a = _a
    assert(a)
    while (s.length < n) {
        s.push(a)
        yield a // yield the debruijn sequence
        B.push(a) // create the debruijn sequence array
        if (s.length == n) break
    }
    const w0 = W.blaze([...s], s.reduce((p, c) => p + c.description, ""))
    S.add(w0) // add the first "word" to the set
    let i = 0
    while (i < k ** n) {
        s.shift()
        for (const a of A) { // iterate through the alphabet
            s.push(a) // append the character to the "string"



            const w = W.blaze([...s], s.reduce((p, c) => p + c.description, "")) // get the "word" for the "string"
            if (S.has(w)) { s.pop(); continue } // if the "word" is in the set, continue



            yield a // yield the debruijn sequence
            B.push(a) // create the debruijn sequence array
            S.add(w) // add the "word" to the set
            if (B.length == k ** n) return { S, B } // if the debruijn sequence is complete, return
            break // break the loop
        }
        i++
    }
    return { S, B }
}

const dbjfoo = Array.from("CIEYR").map(Symbol)
const dbjbar = dbjfoo.slice(1).concat(dbjfoo.slice(0, 1))
const A = new Set(dbjbar)
const n = 5
const debruijnFPT = debruijn(A, n)

const foo = n - 2 // not really sure what this represents
const l = Math.floor(foo / 2)
const r = foo - l

let b = ""
for (const a of debruijnFPT) b += a.description
console.log(b.length)
let i = 0
// // greedy
// while (true) {
//     i++
//     let pin: undefined | { removable: string, match: string }
//     for (let i = 0; i < b.length; i++) {
//         const match = b.slice(i).match(`((.)(((.{0,${l}}\\2)(.{0,${r}}\\2))|((.)((.{0,${r}}\\2)(.{0,${l}}\\2))+)+)+)`)?.[0]
//         if (!match) continue
//         const removable = match.slice(n - 1, -n + 1)
//         if (!removable) continue
//         if (!pin) { pin = { removable, match }; break }
//         if (match.length < pin.match.length) continue
//         pin.match = match
//     }
//     let repeat: undefined | string
//     for (const match of (b.match(/(.)\1+/g) ?? [])) {
//         if (!match) continue
//         if (!repeat) { repeat = match; break }
//         if (match.length < repeat.length) continue
//         repeat = match
//     }
//     if (repeat && (!pin || repeat.length >= pin.removable.length)) {
//         console.log(repeat, repeat[0]!)
//         b = b.replace(repeat, repeat[0]!)
//     } else if (pin && (!repeat || pin.match.length >= repeat.length)) {
//         console.log(pin.match, pin.match.replace(pin.removable, ""))
//         b = b.replace(pin.match, pin.match.replace(pin.removable, ""))
//     } else {
//         break
//     }
//     console.log(i, b.length)
// }

let bc = b
const prsu = (a: number) => `.{0,${a}}\\1` // .{0,2}\1
const pru = (a: number, b: number) => `${prsu(a)}${prsu(b)}` // .{0,2}\1.{0,1}\1
const pruc = (a: number, b: number) => `((${pru(a, b)})+|(${pru(b, a)})+)` // ((.{0,2}\1.{0,1}\1)+|(.{0,1}\1.{0,2}\1)+)
const pinReg = l == r
    ? new RegExp(`(.)${prsu(l)}`, "g")
    : new RegExp(`(?:(.)${pruc(l, r)})`, "g")
while (true) {
    i++
    const applyPinComplex = () => {
        let i = 0
        let state: undefined | { start: number, char: string, context: string[], d: number, leg: undefined | number, legs: [number, number] }
        for (const c of bc) {
            if (!state) state = { start: i, char: c, context: [], d: 0, leg: undefined, legs: [l, r] }
            state.context.push(c)
            if (state.context.length > Math.max(l, r)) {
                state.context.shift()
            }
            if (c == state.char) {
                if (state.d >= Math.min(...state.legs)) state.leg = state.d
                state.d = 0
                continue
            } else {
                state.d++
                
            }
            i++
        }
    }
    const applyPinMostSignificant = () => {
        let pin: undefined | { match: string, removable: string }
        for (const [match] of bc.slice(i).matchAll(pinReg)) {
            const removable = match.slice(n - 1, 1 - n)
            if (!removable) continue
            if (!pin || removable.length > pin.removable.length) pin = { match, removable }
        }
        if (!pin) return false
        const { match, removable } = pin
        console.log(match, match.replace(removable, ""))
        bc = bc.replace(match, match.replace(removable, ""))
        return true
    }
    const applyPinFirstSignificant = () => {
        for (const [match] of bc.slice(i).matchAll(new RegExp(pinReg))) {
            const removable = match.slice(n - 1, 1 - n)
            if (!removable) continue
            console.log(match, match.replace(removable, ""))
            bc = bc.replace(match, match.replace(removable, ""))
            return true
        }
    }
    const applyRepeatSimple = () => {
        const match = bc.match(/(.)\1+/g)?.[0]
        if (!match) return false
        console.log(match, match[0]!)
        bc = bc.replace(match, match[0]!)
        return true
    }
    let foo = bc.match("CIYER")?.[0]
    let bc0 = bc
    if (applyPinMostSignificant() || applyRepeatSimple()) {
        let bar = bc.match("CIYER")?.[0]
        if (foo && !bar) console.log("###", bc0)
        console.log(i, bc.length)
        continue
    } else break
    
}

const perms = "CIEYR, CIERY, CIYER, CIYRE, CIREY, CIRYE, CEIYR, CEIRY, CEYIR, CEYRI, CERIY, CERYI, CYIER, CYIRE, CYEIR, CYERI, CYRIE, CYREI, CRIEY, CRIYE, CREIY, CREYI, CRYIE, CRYEI, ICEYR, ICERY, ICYER, ICYRE, ICREY, ICRYE, IECYR, IECRY, IEYCR, IEYRC, IERCY, IERYC, IYCER, IYCRE, IYECR, IYERC, IYRCE, IYREC, IRCEY, IRCYE, IRECY, IREYC, IRYCE, IRYEC, ECIYR, ECIRY, ECYIR, ECYRI, ECRIY, ECRYI, EICYR, EICRY, EIYCR, EIYRC, EIRCY, EIRYC, EYCIR, EYCRI, EYICR, EYIRC, EYRCI, EYRIC, ERCIY, ERCYI, ERICY, ERIYC, ERYCI, ERYIC, YCIER, YCIRE, YCEIR, YCERI, YCRIE, YCREI, YICER, YICRE, YIECR, YIERC, YIRCE, YIREC, YECIR, YECRI, YEICR, YEIRC, YERCI, YERIC, YRCIE, YRCEI, YRICE, YRIEC, YRECI, YREIC, RCIEY, RCIYE, RCEIY, RCEYI, RCYIE, RCYEI, RICEY, RICYE, RIECY, RIEYC, RIYCE, RIYEC, RECIY, RECYI, REICY, REIYC, REYCI, REYIC, RYCIE, RYCEI, RYICE, RYIEC, RYECI, RYEIC".split(", ")
perms.push(perms[0]!)
const matches = perms.map(perm => bc.match(perm)).filter(match => match)
console.log(perms.length, matches.length)
console.log(perms.filter(perm => !bc.match(perm)))

// CRIEICRIECIEYIEYCIEYREIEYRYIEYRIEYRCIEYCEYIEYCRIEYCIERIYEIERYIERYRIERYCIEREIEIERCIERCEIERCYIERCRIECICEYEIECYIECYRIECYCIECREIECRYIECRIYEIRYIYERIYERCIYECEIYECYIYECRIYECIYEIRIYCIYRIRICIYREIYREYRIYRECIYRYEYCIYREIYIYRCIYRCEIYRCYCIYCEIYCEYIYCERIYCECICIYCREIYCRYEICIREIEIREYIREYRIREYCIREREIRECYIRECRIRECIRYICIRYEIRYEYIRYERIRYECIRYERCIRYCEIRYCYIRYCRIRYCRCIRCEIRCEYIRCERCIRCYEIRCYIRCYRCEYEICEYICEYRICEYCEICERYICERICERCYICYERICYECYCICYREICYRYICYRICYRCICREICREYICRERICRECICRYEICRYICRYRICRYCREYRCEYRCYREYECRCERCYERCYRCYRYEYRECRCRCRIE
// CIERY
console.log(bc, bc.length)


Deno.exit()


// GCLA0 - Generator Conditional Arity-0
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#if...else_statement
// C - condition
// I - statement1
// E - statement2
// R - return in statement1, yield  in statement2
// Y - yield  in statement1, return in statement2

enum GCLA0M {
    NULL,
//5 CRIEICRIECIEYIEYCIEYREIEYRYIEYRIEYRCIEYCEYIEYCRIEYCIERIYEIERYIERYRIERYCIEREIEIERCIERCEIERCYIERCRIECICEYEIECYIECYRIECYCIECREIECRYIECRIYEIRYIYERIYERCIYECEIYECYIYECRIYECIYEIRIYCIYRIRICIYREIYREYRIYRECIYRYEYCIYREIYIYRCIYRCEIYRCYCIYCEIYCEYIYCERIYCECICIYCREIYCRYEICIREIEIREYIREYRIREYCIREREIRECYIRECRIRECIRYICIRYEIRYEYIRYERIRYECIRYERCIRYCEIRYCYIRYCRIRYCRCIRCEIRCEYIRCERCIRCYEIRCYIRCYRCEYEICEYICEYRICEYCEICERYICERICERCYICYERICYECYCICYREICYRYICYRICYRCICREICREYICRERICRECICRYEICRYICRYRICRYCREYRCEYRCYREYECRCERCYERCYRCYRYEYRECRCRCRIE

//5 CRIYRIYRIYERIYCRIEIREIRICYRICERICRIYRYIERYICRYIRYCRYEIRYEYRYERYECRYCIRYCYRYCERYC
//  ERYCREIREIYREIEREICREYIRYEREYCREIRECRECIRECYRECERCIRCIYRCIERCICRCYIRCYRCYERCYCRC
//  YCRCEIRCEYRCERIYRIYERIYCRIEIRIEYRIECIRICYRICERICRIYRIYERIYCRIYEIYRIYERIYECRIYCIY
                                                              CRIYE                 ,
//  YCIYRIYCERIYCRIERYIRIEYRIEYERIEYCRIEIRIEYRIERIECRIECIRIECYRIECERYIRICYRICYERICYC
//  ICYCRICEIRICEYRICERICECRCIRICYRICERICRIYRYIERYICRYIYIEYRYIERYIECRYICIRYICYRYICER
//  ICERYICRYREIYRYIERYICRYIRYCRYEIRYEYRYERYECRYCIRYCYRYCERYCRERCRYEIRYEIYERYEICRYEY
//  RYEYIYCRYEIRYEYRYERYECRYECIRYECYCRYCIRYCIYRYCIERYCICRCRYCEIRYCEYRYCERYCECRYCIRYC
//  IRYCYRYCERYCREIREIYREIEREICREIYIREIYREIYEREIYCREIEIREICYREICEREICREYRCREYIREYIYR
//  YIYREYIEREYICREYIRYEREYCREYEIECREYCIREYCYREYCEREYCRERCREIREIYREIEREICREYIRYEREYC
//  REYCREIRECRECIRECYRECERCRECIRECIYRECIECRECYIRECYRECYECRECIRECYRECERCIRCIYRCIERCI
                                             CYIRE                                  ,
//  ERCICRIRCIYRCIYERCIYCIRCIEYRCIERCIECICRCYIRCYIYRCYIERCYICRCYIRCYRCYERCYCRCYEIRCY
//  IRCYEYRCYERCYECYCRCEIRCEIYRCEIERCEICRCEYIRCEYRCEYERCEYCRCEIRCEYRCERCIRCIYRCIERCI
//  ERCICRCYIRCYRCYERCYCRCEIRCEYRCERCIECYIECEICYICYEICYCICEYICEICYIYCEIYCIYEIYECIYEC
//  IYECYEYIYCEIYCECICYIYCEIYCIYEIEYCIEYEYCEIEYCIEICYEYIECIECYIECEICIECYIECYECIECYIE
//  CYIECEICYICYEICYCIYICYEICYECYCICEYICEYEICEYCICEYICEICYICYEICYCICEYICIECECECRIY
}



// GFLA0 - Generator For Loop Arity-0
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#for_statement
// I - initialization
// C - condition
// A - afterthought
// S - statement

enum GFLA0M {
    NULL,
//1 IPAS
    I  ,
     P ,
      A,
        S,
//2 FPTPFTF
    FP     ,
     PT    ,
        FT ,
//3 FPTPFPTPTFPFTPFTFTF
    FPT                ,
}

interface GFLA0<
    I extends () => void,
    P extends () => boolean,
    A extends () => void,
    S extends () => void
> {
    [GFLA0M.NULL]:    (                                            ) => Generator<void, never, never>
    [GFLA0M.I   ]: <T>(i: I                             ) => Generator<T   , never, T    >
    [GFLA0M.P   ]: <T>(                 p: P      ) => Generator<void, void , never>
    [GFLA0M.A   ]: <T>(                                        a: A) => Generator<T   , T    , T    >
    [GFLA0M.S  ]: <T>(i: () => void, p: (t?: T) => boolean      ) => Generator<T   , void , T    >
    [GFLA0M.FT  ]: <T>(f: (t : T) => T,                        t: T) => Generator<T   , never, T    >
    [GFLA0M.PT  ]: <T>(                 p: (t : T) => boolean, t: T) => Generator<T   , T    , T    >
    [GFLA0M.FPT ]: <T>(f: (t : T) => T, p: (t : T) => boolean, t: T) => Generator<T   , T    , T    >
}

const gflA0: GFLA0 = {
    *[GFLA0M.NULL](       ) { for (           ;     ;         )      yield        ;          },
    *[GFLA0M.I   ](i      ) { for (i();     ; t = f(t)) t = (yield t) ?? t;          },
    *[GFLA0M.P   ](   p   ) { for (           ; p( );         )      yield        ; return   },
    *[GFLA0M.T   ](      t) { for (           ;     ;         ) t = (yield t) ?? t;          },
    *[GFLA0M.FP  ](f, p   ) { for (let t = f(); p(t); t = f(t)) t = (yield t) ?? t; return   },
    *[GFLA0M.FT  ](f,    t) { for (           ;     ; t = f(t)) t = (yield t) ?? t;          },
    *[GFLA0M.PT  ](   p, t) { for (           ; p(t);         ) t = (yield t) ?? t; return t },
    *[GFLA0M.FPT ](f, p, t) { for (           ; p(t); t = f(t)) t = (yield t) ?? t; return t }
}



// GLA1 - Generator Looper Arity-1
// F - mutating function
// P - predicate
// T - terminal/initial value

enum eGLA1 {
    NULL,
//1 FPT
    F  ,
     P ,
      T,
//2 FPTPFTF
    FP     ,
     PT    ,
        FT ,
//3 FPTPFPTPTFPFTFT
    FPT                ,

//3 FPTFTFP
    FPT
}

interface GLA1 {
    [eGLA1.NULL]:    (                                            ) => Generator<void, never, never>
    [eGLA1.F   ]: <T>(f: (t?: T) => T                             ) => Generator<T   , never, T    >
    [eGLA1.P   ]: <T>(                 p: (t?: T) => boolean      ) => Generator<void, void , never>
    [eGLA1.T   ]: <T>(                                        t: T) => Generator<T   , T    , T    >
    [eGLA1.FP  ]: <T>(f: (t?: T) => T, p: (t?: T) => boolean      ) => Generator<T   , void , T    >
    [eGLA1.FT  ]: <T>(f: (t : T) => T,                        t: T) => Generator<T   , never, T    >
    [eGLA1.PT  ]: <T>(                 p: (t : T) => boolean, t: T) => Generator<T   , T    , T    >
    [eGLA1.FPT ]: <T>(f: (t : T) => T, p: (t : T) => boolean, t: T) => Generator<T   , T    , T    >
}

const glA1: GLA1 = {
    *[eGLA1.NULL](       ) { for (           ;     ;         )      yield        ;          },
    *[eGLA1.F   ](f      ) { for (let t = f();     ; t = f(t)) t = (yield t) ?? t;          },
    *[eGLA1.P   ](   p   ) { for (           ; p( );         )      yield        ; return   },
    *[eGLA1.T   ](      t) { for (           ;     ;         ) t = (yield t) ?? t;          },
    *[eGLA1.FP  ](f, p   ) { for (let t = f(); p(t); t = f(t)) t = (yield t) ?? t; return   },
    *[eGLA1.FT  ](f,    t) { for (           ;     ; t = f(t)) t = (yield t) ?? t;          },
    *[eGLA1.PT  ](   p, t) { for (           ; p(t);         ) t = (yield t) ?? t; return t },
    *[eGLA1.FPT ](f, p, t) { for (           ; p(t); t = f(t)) t = (yield t) ?? t; return t }
}

// // number counter step one init zero
// const counter = glA1[eGLA1.FT](n => n + 1, 0)
// console.log(counter.next(  )) // { value:  0, done: false }
// console.log(counter.next(  )) // { value:  1, done: false }
// console.log(counter.next(10)) // { value: 11, done: false }
// console.log(counter.next( 3)) // { value:  4, done: false }

// // number counter step one predicate limit 3 init zero
// const counterLim3 = glA1[eGLA1.FPT](n => n + 1, n => n < 3, 0)
// console.log(counterLim3.next()) // { value: 0, done: false }
// console.log(counterLim3.next()) // { value: 1, done: false }
// console.log(counterLim3.next()) // { value: 2, done: false }
// console.log(counterLim3.next()) // { value: 3, done: true  }

// // constructor factory generator
// class CRAND { r: number = Math.random() }
// const foo = glA1[eGLA1.F](() => new CRAND)

function getItor<T, R, N>(i: Generator<T, R, N>): Iterator<T, R, N> {
    return i[Symbol.iterator]()
}

// get the next iterator result and defer to safeYield applied to that result
// "pops" the iterator in a sense
function* safeNext<T, TReturn, TNext>(i: Iterator<T, TReturn, TNext>): Generator<T, void, void> {
    yield* safeYield(i.next())
}

// takes an iterator result and yields the value if not done
function* safeYield<T, TReturn>({ done, value }: IteratorResult<T, TReturn>): Generator<T, void> {
    if (done) return; else yield value
}

const safeYield2 = <T, R>(i: Iterator<T, R>) => glA1[eGLA1.FPT](r => r.value, r => !r.done, i.next())

const counterFoo = glA1[eGLA1.FP]((n: number = 0) => n + 1, n => (n ?? 0) < 0)

const itor = genToItor(counterFoo)
const v = itor.next().value // const v: number | void
for (const v of safeNext(itor)) console.log(v) // 0, const v: number
for (const v of safeNext(itor)) console.log(v) // 1, const v: number
for (const v of safeNext(itor)) console.log(v) // 2, const v: number

// class StateGen<T, TReturn, TNext> {
//     state: undefined | IteratorResult<T, TReturn>
//     constructor(public gen: Generator<T, TReturn, TNext>) {}
//     get next() { return this.state = this.gen.next() }
//     get done() { return this.state?.done }
//     get value() { return this.state?.value }
// }

// const baz = fooA1[GenLoopA1.PT](sg => !sg.next.done, new StateGen(counterLim5))

// for (const a of baz) console.log(a)

// yields A, then B
// if either is done, this will yield fewer than two values
// function* foo<A, B>(ia: Iterator<A>, ib: Iterator<B>) {
//     for (const a of bar(ia.next()))
//         for (const b of bar(ib.next())) yield <[A, B]>[a, b]
// }

// function* baz<A, B>(as: Iterable<A>, bs: Iterable<B>): Generator<[A, B]> {
//     const [ia, ib] = [as[Symbol.iterator](), bs[Symbol.iterator]()]
//     while (true) yield* foo(ia, ib)
// }



// take n elements from an iterable
// always yields equal to min n |as|
// may be able to use that to implement "crunch"
export function* take<A>(as: Iterable<A>, n:number): Generator<A> {
    let i = 0; for (const a of as) if (i++ < n) yield a; else break
}

// lift an an unary function over iterables
export function liftA1<A, R>(f: (a: A) => R): (as: Iterable<A>) => Generator<R> {
    return function* (as: Iterable<A>) { for (const a of as) yield f(a) }
}

// fold an iterable with a binary function
export function foldA1<A, B>(f: (a: A, b?: B) => B): (as: Iterable<A>) => undefined | B
export function foldA1<A, B>(f: (a: A, b: B) => B, b: B): (as: Iterable<A>) => B
export function foldA1<A, B>(f: (a: A, b?: B) => B, b?: B): (as: Iterable<A>) => undefined | B {
    return function (as: Iterable<A>) { for (const a of as) b = f(a, b); return b }
}

export function iterate(i: Iterable<unknown>): void {
    for (const _ of i);
}

export function applyA0<R>(f: () => R): R {
    return f()
}

export function applyA1<A, R>(f: (a: A) => R, a: A): R {
    return f(a)
}

export function applyA2<A, B, R>(f: (a: A, b: B) => R, a: A, b: B): R {
    return f(a, b)
}