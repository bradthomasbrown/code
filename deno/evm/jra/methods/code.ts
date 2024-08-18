import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.1.1/mod.ts'
import * as schemas from "../schemas/mod.ts";
import { Tag } from '../types/Tag.ts';

export async function code(rpc: string, address:string, tag:Tag) {
  const method = "eth_getCode";
  const params = [
    address,
    typeof tag == 'bigint' ? `0x${tag.toString(16)}` : tag
  ]
  const schema = schemas.string;
  return schema.parse(await new jra.Client(rpc).request(method, params, 0))
}
