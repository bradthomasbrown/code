export interface WorldState {
  [key: string]: AccountState
}

export interface AccountState {
  balance?: bigint
}