import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.1.1/mod.ts'
import * as schemas from "../schemas/mod.ts";

export async function receipt(rpc:string, hash:string) {
  const method = "eth_getTransactionReceipt";
  const params:[hash:string] = [hash];
  const schema = schemas.receipt;
  return schema.parse(await new jra.Client(rpc).request(method, params, 0))
}
