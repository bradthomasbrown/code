import { Cache } from "../../../../stdplus/cache/lib/mod.ts";
import { output as outputSchema } from "../schemas/mod.ts";
import { compile } from "../../compile/lib/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.224.0/path/from_file_url.ts";

const edgeCase = "UniswapV3Factory";
const cache = new Cache(
  fromFileUrl(import.meta.resolve(`../../compile/fixtures`)),
);
const path = `${edgeCase}.json`;
const retrieve = async () => {
  const { params } = await import(`../../compile/tests/params.ts`);
  const results = await compile(params[edgeCase]);
  await cache.writeTextFile(path, results);
};
const outputString = await cache.readTextFile({ path, retrieve });
Deno.test(`parse ${edgeCase}`, () => {
  outputSchema.parse(outputString);
});
