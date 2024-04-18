type RespondArgs = {
  code:number
  message:string
  status:number
  id?:number|string|null
}

export function error({ code, message, status, id }:RespondArgs) {
  const jsonrpc = '2.0'
  id ??= null
  const error = { code, message }
  const body:BodyInit = JSON.stringify({ jsonrpc, error, id })
  const headers = { 'Content-Type': 'application/json' }
  const init:ResponseInit = { status, headers }
  return new Response(body, init)
}