import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.1.1/mod.ts'

export async function traceTx(rpc: string, hash:string) {
  const method = "debug_traceTransaction";
  const params = [
    hash,
    {
        enableMemory: true,
        disableStack: false,
        disableStorage: false,
        enableReturnData: true
    }
  ]
  const schema = jra.schemas.json;
  return schema.parse(await new jra.Client(rpc).request(method, params, 0))
}
