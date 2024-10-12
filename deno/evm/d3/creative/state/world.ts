import { ECDH } from "node:crypto";
import { Account } from './account.ts'

export type World = Map<ECDH, Account>