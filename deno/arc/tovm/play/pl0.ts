import { ECDH, createECDH } from "node:crypto";
import { crypto } from "jsr:@std/crypto"
import { encodeHex } from "jsr:@std/encoding/hex"

const k = (b: Uint8Array): ArrayBuffer => crypto.subtle.digestSync("KECCAK-256", b)

const bᴇ = (n: bigint, exp: bigint): bigint => n * 10n ** exp;

type TupleOf<T, N extends number, Acc extends T[] = []>
    = Acc['length'] extends N
        ? Acc
        : TupleOf<T, N, [T, ...Acc]>

function applyA0<R>(f: () => R) {
    return f()
}

function applyNA0<const N extends number, R>(n: N, f: () => R) {
    return <TupleOf<R, N>>Array(n).fill(f).map(applyA0)
}

function lzctorA0<R>(c: new () => R) {
    return () => new c
}

function makeNA1<N extends number, T, P>(n: N, c: new (p: P) => T): (p: P) => TupleOf<T, N> {
    return (p: P) => <TupleOf<T, N>>Array(n).fill(() => new c(p)).map(applyA0)
}

function makeNA0<T, N extends number>(n: N, c: new () => T): TupleOf<T, N> {
    return <TupleOf<T, N>>Array(n).fill(lzctorA0(c)).map(applyA0)
}

class Signer {

    #signer: Signer.ISigner

    constructor(type: Signer.Type.Real)
    constructor(type: Signer.Type.NotReal, address: string)

    constructor(type: Signer.Type, address?: string) {
        switch (type) {
            case Signer.Type.Real: this.#signer = new Signer.Real; break
            case Signer.Type.NotReal: this.#signer = new Signer.NotReal(<string>address); break
        }
    }

    get address(): string {
        return this.#signer.address
    }
}

// deno-lint-ignore no-namespace
namespace Signer {
    export enum Type {
        Real,
        NotReal
    }

    export interface ISigner {
        address: string
    }

    export class Real implements ISigner {
        #$ecdh: undefined | ECDH
        get #ecdh(): ECDH {
            return this.#$ecdh ??= ((e = createECDH("secp256k1")) => (e.generateKeys(), e))()
        }

        #$pub: undefined | Uint8Array
        get #pub(): Uint8Array {
            return this.#$pub ??= this.#ecdh.getPublicKey()
        }

        #$address: undefined | string
        get address(): string {
            return this.#$address ??= `0x${encodeHex(k(this.#pub).slice(-20))}`
        }
    }

    export class NotReal implements ISigner {
        constructor(public readonly address: string) {}
    }

    
}

// deno-lint-ignore no-namespace
namespace Tx {
    export enum Type {
        Legacy = 0,
        AccessList = 1, // EIP2930 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2930.md
        FeeMarket = 2 // EIP1559 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md
    }

    interface Base {
        nonce: bigint
        gasPrice: bigint
        gasLimit: bigint
        to: string
        value: bigint
        r: bigint
        s: bigint
    }

    interface Init {
        init: Uint8Array
        data?: never
    }

    interface Data {
        data: Uint8Array
        init?: never
    }

    interface Post1559 {
        accessList: [string, bigint[]][]
        chainId: bigint
        yParity: 0 | 1
    }

    export interface Variant {
        [Type.Legacy]: (Init | Data) & Base & {
            type: Type.Legacy,
            w: bigint
        }
        [Type.AccessList]: (Init | Data) & Base & Post1559 & {
            type: Type.AccessList
        }
        [Type.FeeMarket]: (Init | Data) & Base & Post1559 & {
            type: Type.FeeMarket,
            maxFeePerGas: bigint,
            maxPriorityFeePerGas: bigint
        }
    }

}

type Tx
    = Tx.Variant[Tx.Type.Legacy]
    | Tx.Variant[Tx.Type.AccessList]
    | Tx.Variant[Tx.Type.FeeMarket]

const G = {
    zero: 0n,
    jumpdest: 1n,
    base: 2n,
    verylow: 3n,
    low: 5n,
    mid: 8n,
    high: 10n,
    warmaccess: 100n,
    accesslistaddress: 2400n,
    accessliststorage: 1900n,
    coldaccountaccess: 2600n,
    coldsload: 2100n,
    sset: 20000n,
    sreset: 2900n,
    sclear: 4800n,
    selfdestruct: 5000n,
    create: 32000n,
    codedeposit: 200n,
    initcodeword: 2n,
    callvalue: 9000n,
    callstipend: 2300n,
    newaccount: 25000n,
    exp: 10n,
    expbyte: 50n,
    memory: 3n,
    txcreate: 32000n,
    txdatazero: 4n,
    txdatanonzero: 16n,
    transaction: 21000n,
    log: 375n,
    logdata: 8n,
    logtopic: 375n,
    keccak256: 30n,
    keccak256word: 6n,
    copy: 3n,
    blockhash: 20n,
} as const

// deno-lint-ignore no-namespace
namespace Account {
    export interface State {
        nonce: bigint
        balance: bigint
        storageRoot?: never
        codeHash?: never
    }
}

class Accounts extends Map<Signer, Account.State> {
    override get(s: Signer): Account.State {
        return this.#getSet(s, Accounts.#newEmptyState())
    }

    #getSet(s: Signer, state: Account.State): Account.State {
        return super.get(s) ?? (this.set(s, state), state)
    }

    static #newEmptyState(): Account.State {
        return { balance: 0n, nonce: 0n }
    }

    serializedObject(): object {
        return [...this].map(([k, v]) => [
            k.address,
            Object.entries(v).map(([k, v]) => {
                if (typeof v == "bigint") return [k, v.toString()]
                return [k, v]
            })
        ])
    }
}

// deno-lint-ignore no-namespace
export namespace World {
    export class State {
        accounts: Accounts = new Accounts

        setBalance(s: Signer, balance: bigint): void {
            this.accounts.set(s, { ...this.accounts.get(s), balance })
        }

        serializedObject(): object {
            return { accounts: this.accounts.serializedObject.bind(this.accounts)() }
        }
    }
}

export class Api {
    nonce(this: World.State, s: Signer): bigint {
        return this.accounts.get(s).nonce
    }

    estimateGas(this: World.State, s: Signer, tx: Tx): bigint {
        const { data: T_d, init: T_i } = tx
        const {
            txdatanonzero: G_txdnz, txdatazero: G_txdz,
            initcodeword: G_initcodeword, txcreate: G_txcreate,
            transaction: G_tx, accesslistaddress: G_accladdr,
            accessliststorage: G_acclstor
        } = G
        const { accessList: T_a } = "accessList" in tx ? tx : { accessList: undefined }
        
        const G0_calldata = (T_d ?? T_i).reduce((acc, b) => acc + (b ? G_txdnz : G_txdz), 0n)
        const G0_txcreate = BigInt(tx.to) ? 0n : G_txcreate + BigInt(Math.ceil((T_i ?? []).length / 32)) * G_initcodeword
        const G0_tx = G_tx
        const G0_accl = T_a ? T_a.reduce((acc, [_addr, slots]) => acc + G_accladdr + BigInt(slots.length) * G_acclstor, 0n) : 0n
        const G0 = G0_calldata + G0_txcreate + G0_tx + G0_accl

        const intrinsicGas = G0
        return intrinsicGas
    }
}

export class Node {
    #state: World.State = new World.State
    #api: Api = new Api

    setBalance: (signer: Signer, value: bigint) => void = this.#state.setBalance.bind(this.#state)

    nonce: (signer: Signer) => bigint = this.#api.nonce.bind(this.#state)

    estimateGas: (signer: Signer, tx: Tx) => bigint = this.#api.estimateGas.bind(this.#state)

    serialize(space?: string | number): string {
        return JSON.stringify({ state: this.#state.serializedObject.bind(this.#state)() }, undefined, space)
    }
}

export class Context {
    constructor(
        public readonly node: Node,
        public readonly signer: Signer
    ) {}

    get nonce(): bigint {
        return this.node.nonce.bind(this.node)(this.signer)
    }

    estimateGas(tx: Tx): bigint {
        return this.node.estimateGas.bind(this.node)(this.signer, tx)
    }
}

const node = new Node
const signers = applyNA0(1, () => new Signer(Signer.Type.Real))
signers.forEach(s => node.setBalance(s, bᴇ(1n, 18n)))
const [signer] = signers
const context = new Context(node, signer)

const gas = context.estimateGas({
    type: Tx.Type.AccessList,
    nonce: 0n,
    gasLimit: 0n,
    to: "0x123",
    value: 0n,
    r: 0n,
    s: 0n,
    data: new Uint8Array([0, 1, 2, 0, 3, 0, 4, 5]),
    gasPrice: 0n,
    accessList: [["0xfoo", [0n, 1n, 2n]], ["0xbar", [0n, 1n]]],
    chainId: 1n,
    yParity: 0
})

console.log(gas) // 67392n