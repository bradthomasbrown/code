type RespondArgs = {
  result:unknown
  id:number|string|null
}

export function respond({ result, id }:RespondArgs) {
  const jsonrpc = '2.0'
  const body:BodyInit = JSON.stringify({ jsonrpc, result, id })
  const headers = { 'Content-Type': 'application/json' }
  const status = 200
  const init:ResponseInit = { status, headers }
  return new Response(body, init)
}