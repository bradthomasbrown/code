// {
//     "inputs": [
//         {"internalType":"address","name":"to","type":"address"},
//         {"internalType":"uint256","name":"tokenId","type":"uint256"}
//     ],
//     "name": "approve",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
// }
import { defaultAbiEncode } from '../../../../../lib/_defaultAbiEncode.ts'
import { isNamedParameters } from '../../../../../lib/_isNamedParameters.ts'
import { namedParametersToIndexed } from '../../../../../lib/_namedParametersToIndexed.ts'

type ParametersIndexed = [to: string, tokenId: bigint]
type ParametersNamed = [{ to: string, tokenId: bigint }]
type Parameters = ParametersIndexed | ParametersNamed

const inputs:Array<{ type: string }> = []

export const selector = 'a0b1c2d3'
const inputTypes = inputs.map(({ type }) => type)
const signature = 'address,uint256'
const parameterNames = ['to', 'tokenId']
export const stateMutability = 'nonpayable'

export function approve(to: string, tokenId: bigint):string
export function approve({ to, tokenId }:{ to: string, tokenId: bigint }):string
export function approve(...parameters:Parameters):string {

    if (isNamedParameters<ParametersIndexed, ParametersNamed>(parameters, signature))
        parameters = namedParametersToIndexed<ParametersIndexed, ParametersNamed>(parameters, parameterNames)

    const data = defaultAbiEncode(inputTypes.map((type, i) => [type, parameters[i]]))

    return `0x${selector}${data}`

}