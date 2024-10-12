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

// const fnApp2 = <A, B, C>(f: (a: A, b: B) => C, [a, b]: [A, B]) => f(a, b)

// const zip = <A, B>(as: Iterable<A>, bs: Iterable<B>): Iterable<[A, B]> => iterableCrunch(as, bs)

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

const fixedEnglish = `
c|pʰ  |Pen
 |p   |sPin
 |b   |But
 |b̥   |Web
 |t   |sTing
 |ɾ   |beTTer
 |d   |Do
 |d̥   |oDD
 |tʃʰ |CHair
 |tʃ  |teaCH naTure
 |dʒ  |Gin Joy
 |d̥ʒ̊  |eDGE
 |k   |sKin uniQUE thiCK
 |kʰ  |Cat Kill Queen
 |g   |Go Get
 |ɡ̊   |beG
 |f   |Fool enouGH oFF PHoto
 |v   |Voice
 |v̥   |haVE oF
 |θ   |THing
 |ð   |THis breaTHE
 |s   |See City paSS
 |z   |Zoo
 |z̥   |roSe
 |ʃ   |SHe Sure seSSIon emoTIon
 |ʒ   |Genre pleaSUre equaTIon seiZUre
 |ʒ̊   |beiGE
 |h   |Ham
 |m   |Man
 |n   |No
 |ŋ   |riNGer driNk
 |l   |Left beLL sabLE
 |r   |Run
 |w   |We qUeen
 |j   |Yes
 |ʍ   |WHat
 |x   |uGH
 |ç   |HUgh
v|æ   |hAm
 |a:/æ|pAss
 |a   |fAther pAlm
 |ɒ   |nOt
 |ɒ/ɔ:|Off
 |ɔ:  |lAW pAUse thOUGHt
 |ə   |About
 |I   |bIt
 |i   |citY
 |i:  |sEE
 |eI  |dAte dAY
 |ɛ   |bEd
 |ʌ   |rUn
 |ʊ   |pUt hOOd
 |u:  |thrOUgh thrEW
 |ju: |cUte
 |aI  |prIce flIGHt mY
 |ɔI  |chOIce bOY 
 |oʊ  |gOAt nO tOW sOUl
 |aʊ  |mOUth nOW
 |a:r |stARt
 |Iər |nEAR dEER
 |ɛər |squARE
 |ɜ:r |nURse bIRd EARth
 |ər  |lettER donOR
 |ɔ:r |nORth tORE
 |ʊər |tOUR
 |jʊər|pURE
`

type ParseExamples<S, E extends string[] = []>
  = S extends `${infer W} ${infer Tail}`
    ? ParseExamples<Tail, [...E, W]>
  : [...E, S]

type ParseGram<S>
  = S extends `${infer G} ${string}`
    ? G
  : S

type ParseLine<S, K extends string = "c", Acc extends unknown[] = []>
  = S extends `${infer C extends " " | "c" | "v"}|${infer G}|${infer E}\n${infer Tail}`
    ? ParseLine<
      Tail,
      { " ": K, c: "c", v: "v" }[C],
      [...Acc, { k: { " ": K, c: "c", v: "v" }[C], g: ParseGram<G>, e: ParseExamples<E> }]>
  : Acc

type ToDiaphonemes<S>
  = S extends `\n${infer Tail}`
    ? ParseLine<Tail>
  : never

type Foo = ToDiaphonemes<typeof fixedEnglish>

interface Diaphoneme {
  k: 'c' | 'v'
  g: string,
  e: string[]
}

const diaphonemes: Diaphoneme[] = []
let k: 'c' | 'v' = 'c'
for (const match of fixedEnglish.trim().split('\n')) {
  const [_k, g, e] = <['c' | 'v', string, string]>match.split('|').map(s => s.trim())
  k = _k ? _k : k
  if (g.match(/[:]/)) continue
  diaphonemes.push({ k, g, e: e.split(' ') })
}

const nasal = diaphonemes.filter(d => ['m', 'n', 'ŋ'].includes(d.g))
const plosiveFortis = diaphonemes.filter(d => ['p', 't', 'tʃ', 'kʰ'].includes(d.g))
const plosiveLenis = diaphonemes.filter(d => ['b', 'd', 'dʒ', 'g'].includes(d.g))
const plosive = [...plosiveFortis, ...plosiveLenis]
const fricativeFortis = diaphonemes.filter(d => ['f', 'θ', 's', 'ʃ', 'h'].includes(d.g))
const fricativeLenis = diaphonemes.filter(d => ['v', 'ð', 'z', 'ʒ', 'h'].includes(d.g))
const fricative = [...fricativeFortis, ...fricativeLenis]
const approximant = diaphonemes.filter(d => ['w', 'l', 'r', 'j'].includes(d.g))

const consonants = diaphonemes.filter(d => d.k === 'c')
const vowels = diaphonemes.filter(d => d.k === 'v')

const nonSibilantFricativeFortis = fricativeFortis.filter(d => ['f', 'θ'].includes(d.g))

const foo = (xs: string[], ys: string[]) => xs.map(x => ys.map(y => [x, y])).flat()
const bar = (xss: string[][], ys: string[]) => xss.map(xs => ys.map(y => [...xs, y])).flat()
const tog = (x: Diaphoneme) => x.g

const single = (c: string) => diaphonemes.find(d => d.g == c)

const j = [single('j')!]
const v = [single('v')!]
const s = [single('s')!]

const plosivePlusApproximantNotJ = foo(plosive.map(tog), approximant.filter(a => a.g !== 'j').map(tog))
const fricativeFortisOrVPlusApproximantNotJ = foo([...fricativeFortis, ...v].map(tog), approximant.filter(a => a.g !== 'j').map(tog))
const consonantNotRNorWPlusJ = foo(consonants.filter(c => c.g !== 'r' && c.g !== 'w').map(tog), j.map(tog))
const sPlusPlosiveFortis = foo(s.map(tog), plosiveFortis.map(tog))
const sPlusNasalNotŋ = foo(s.map(tog), nasal.filter(n => n.g !== 'ŋ').map(tog))
const sPlusNonSibilantFricative = foo(s.map(tog), nonSibilantFricativeFortis.map(tog))
const sPlusPlosiveFortisPlusApproximant = bar(foo(s.map(tog), plosiveFortis.map(tog)), approximant.map(tog))
const sPlusNasalNotŋPlusApproximant = bar(foo(s.map(tog), nasal.filter(n => n.g !== 'ŋ').map(tog)), approximant.map(tog))
const sPlusNonSibilantFricativePlusApproximant = bar(foo(s.map(tog), nonSibilantFricativeFortis.map(tog)), approximant.map(tog))

const onsets = [
  plosivePlusApproximantNotJ,
  fricativeFortisOrVPlusApproximantNotJ,
  consonantNotRNorWPlusJ,
  sPlusPlosiveFortis,
  sPlusNasalNotŋ,
  sPlusNonSibilantFricative,
  sPlusPlosiveFortisPlusApproximant,
  sPlusNasalNotŋPlusApproximant,
  sPlusNonSibilantFricativePlusApproximant
].flat()

const mnl = [single('m')!, single('n')!, single('l')!]
const r = [single('r')!]

const nucleus = [vowels.map(tog), mnl.map(tog), r.map(tog)].flat().map(c => [c])

const l = [single('l')!]
const plosiveOrFricative = [plosive.map(tog), fricative.map(tog)].flat()

const consonantsNotHNorWNorJ = consonants.filter(c => c.g !== 'h' && c.g !== 'w' && c.g !== 'j').map(tog).map(c => [c])
const lPlus_PlosiveOrFricative = foo(l.map(tog), plosiveOrFricative)
const rPlus_PlosiveOrFricative = foo(r.map(tog), plosiveOrFricative)
const lPlusNasal = foo(l.map(tog), nasal.map(tog))
const rPlusNasal = foo(r.map(tog), nasal.map(tog))
const nasalPlus_PlosiveOrFricative = foo(nasal.map(tog), plosiveOrFricative)
const fricativeFortisPlusPlosiveFortis = foo(fricativeFortis.map(tog), plosiveFortis.map(tog))
const fricativeLenisPlusPlosiveLenis = foo(fricativeLenis.map(tog), plosiveLenis.map(tog))
const twoFricativeFortis = foo(fricativeFortis.map(tog), fricativeFortis.map(tog)).filter(([x, y]) => x !== y)
const threeFricativeFortis = bar(twoFricativeFortis, fricativeFortis.map(tog)).filter(([x, y, z]) => x !== y && y !== z)
const twoPlosiveFortis = foo(plosiveFortis.map(tog), plosiveFortis.map(tog)).filter(([x, y]) => x !== y)
const twoPlosiveFortisPlusFricativeFortis = bar(twoPlosiveFortis, fricativeFortis.map(tog))
const plosiveFortisPlusFricative = foo(plosiveFortis.map(tog), fricative.map(tog))
const lPlusTwoConsonants = bar(foo(l.map(tog), consonants.map(tog)), consonants.map(tog))
const rPlusTwoConsonants = bar(foo(r.map(tog), consonants.map(tog)), consonants.map(tog))
const nasalPlusPlosiveFortisPlus_PlosiveOrFricative = bar(foo(nasal.map(tog), plosiveFortis.map(tog)), plosiveOrFricative)

const coda = [
  consonantsNotHNorWNorJ,
  lPlus_PlosiveOrFricative,
  rPlus_PlosiveOrFricative,
  lPlusNasal,
  rPlusNasal,
  nasalPlus_PlosiveOrFricative,
  fricativeFortisPlusPlosiveFortis,
  fricativeLenisPlusPlosiveLenis,
  twoFricativeFortis,
  threeFricativeFortis,
  twoPlosiveFortis,
  twoPlosiveFortisPlusFricativeFortis,
  plosiveFortisPlusFricative,
  lPlusTwoConsonants,
  rPlusTwoConsonants,
  nasalPlusPlosiveFortisPlus_PlosiveOrFricative
].flat()

const onsetGen = (function* () {
  while (true) {
    yield Math.random() < 0.8
      ? []
      : onsets[Math.floor(Math.random() * onsets.length)]!
  }
})()

const nucleusGen = (function* () {
  const foo = () => nucleus[Math.floor(Math.random() * nucleus.length)]!
  while (true) {
    yield Math.random() < 0.1
      ? [foo(), foo()].flat()
      : foo()
  }
})()

const codaGen = (function* () {
  while (true) {
    // yield coda[Math.floor(Math.random() * coda.length)]!
    yield Math.random() < 0.8
      ? coda[Math.floor(Math.random() * coda.length)]!
      : []
  }
})()

const sylGen = (function* () {
  while (true) {
    const ipas = [onsetGen.next().value!, nucleusGen.next().value!, codaGen.next().value!].flat().filter(x => x)
    const foo = ipas.map(ipac => [ipac, ipacToEJoin(ipac)]).reduce<[string, string]>(([ipas, es], [ipac, ec]) => [ipas! += ipac, es! += ec], ['', ''])
    if (foo[1].length < 5) continue
    if (foo[1].match(/(.)\1/)) continue
    if (foo[1].match(/mn$/i)) continue
    if (foo[1].match(/^c/i)) continue
    if (foo[1].match(/our$/i)) continue
    yield foo
  }
})()

const ePick = (e: string[]) => e[Math.floor(Math.random() * e.length)]!

const ipacToEJoin = (ipac: string) => ePick(diaphonemes.find(d => d.g === ipac)!.e).match(/[A-Z]+/)!.join('')

const takeX = [...new ZipList(sylGen).take(20)] //.map(ipacs => ipacs.map(ipac => [ipac, ipacToEJoin(ipac)])).map(foo => foo.reduce<[string, string]>(([ipas, es], [ipac, ec]) => [ipas! += ipac, es! += ec], ['', '']))

// const take20 = [...new ZipList(cvGen).take(20)].map((_, i, cvs) => i % 2 ? [] : [`${cvs[i]!.join('')}.${cvs[i + 1]!.join('')}`]).flat()// .map(cv => [cv.join(''), ipaToEJoin(cv)])

console.log(takeX)

// TIRO 1e-5
// GLIGH 1e-7
// SHUL 1e-5
// VUN 1e-5
// FROA 1e-6
// FLURE 1e-6
// ZYA 1e-5
// VEYA 1e-6
// KYI 1e-5
// VRUA 1e-7
// LEYE 1e-6
// KYORY 1e-∞
// SNUI 1e-7
// VUAU 1e-∞ # USING, the name of the name generation capability
// SKLEOUR 1e-∞
// VEYA 1e-6
// JUNY 1e-6
// ZYI 1e-6
// OUMN 1e-7 # USING, the name of the overall ontology, which should map to the /root dir here at time of writing
// AOUR 1e-7 used by some artist very recently
// AURE 1e-6
// TIRI 1e-6
// ARELE 1e-6
// KYARELE 1e-∞
// CHYIA 1e-6
// CHYAURE 1e-∞
// LEAY 1e-6
// GYAREOR 1e-∞, true unknown. but now we realize it could be prounounced very similar to diarrhea :c
// GYOYO 1e-∞
// AUMN 1e-6
// dʒjamn JYAMN, not considering, but very funny. 1e-∞
// JEYMO 1e-∞
// LEYOA 1e-∞
// SCROY 1e-∞
// GROUA 1e-7
// OURURE 1e-∞
// STLURE 1e-∞
// STHUO 1e-∞
// ORIGH 1e-7
// HRUI 1e-7
// FRARIR 1e-∞
// GLAREI 1e-∞
// AYURE 1e-7
// TALEUREI 1e-∞
// ERARE ?
// OARSCH ?
// ELETHET 1e-∞ # USING, the name of the blocks that make up our concept of (programming?) languages
// irʒkʰ YRZUC 1e-∞ # USING, an 'event', an input of a machine that 'arises'. If we interpret people as a variant of a machine/function that handles NodeJS/DOM-like events, an YRZUC could be "any thing experienced": a feeling, a thought, an emotion, a sensation.