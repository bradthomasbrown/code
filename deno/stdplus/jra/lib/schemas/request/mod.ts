import { byName, byPosition } from "./mod.ts";
export * from './byName.ts'
export * from './byPosition.ts'
export const request = Object.assign(byName.or(byPosition), { byName, byPosition })