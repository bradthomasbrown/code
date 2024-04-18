type RespondArgs = {
  result:unknown
  id:number|string|null
}

export function respond({ result, id }:RespondArgs) {
  const jsonrpc = '2.0'
  return { jsonrpc, result, id }
}