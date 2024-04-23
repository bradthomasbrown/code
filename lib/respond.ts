type RespondArgs = {
  result:unknown
  id:number|string|null
}

function replacer(_key:unknown, value:unknown) {
  return typeof value == 'bigint'
    ? `0x${value.toString(16)}`
    : value
}

export function respond({ result, id }:RespondArgs) {
  const jsonrpc = '2.0'
  const body:BodyInit = JSON.stringify({ jsonrpc, result, id }, replacer)
  const headers = { 'Content-Type': 'application/json' }
  const status = 200
  const init:ResponseInit = { status, headers }
  return new Response(body, init)
}