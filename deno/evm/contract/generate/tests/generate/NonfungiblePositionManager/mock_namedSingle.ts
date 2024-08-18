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
// import { defaultAbiEncode } from '../../../../../lib/_defaultAbiEncode.ts'
//
// import { namedParametersToIndexed } from '../../../../../lib/_namedParametersToIndexed.ts'

//

//
// const inputTypes = inputs.map(({ type }) => type)
// const signature = 'address,uint256'
// const parameterNames = ['to', 'tokenId']
// export const stateMutability = 'nonpayable'

import { defaultAbiEncode } from "../../../lib/_defaultAbiEncode.ts";
import { inputs } from "./inputs.ts";
import { selector } from "./selector.ts";

export function encode(to: string, tokenId: bigint): string;
export function encode(
  { to, tokenId }: { to: string; tokenId: bigint },
): string;
export function encode(
  ...parameters: [to: string, tokenId: bigint] | [
    { to: string; tokenId: bigint },
  ]
): string {
  return `0x${selector(parameters)}${defaultAbiEncode(parameters, inputs)}`;
}
