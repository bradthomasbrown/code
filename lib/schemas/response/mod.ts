import { error, result } from "./mod.ts";
export * from './error.ts'
export * from './result.ts'
export const response = Object.assign(error.or(result), { error, result })