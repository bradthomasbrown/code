import { error, result } from "schemas/response/mod.ts";
export * from 'schemas/response/error.ts'
export * from 'schemas/response/result.ts'
export const response = Object.assign(error.or(result), { error, result })