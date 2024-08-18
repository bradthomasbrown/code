import { defaultAbiEncode } from '../../../lib/_defaultAbiEncode.ts'
import{ inputs } from'./inputs.ts'
import { selector } from './selector.ts'

export function encode(...parameters:[string, bigint]): string { return `0x${selector(parameters)}${defaultAbiEncode(parameters, inputs)}` }