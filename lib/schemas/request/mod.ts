import { byName, byPosition } from "schemas/request/mod.ts";
export * from 'schemas/request/byName.ts'
export * from 'schemas/request/byPosition.ts'
export const request = Object.assign(byName.or(byPosition), { byName, byPosition })