import { compile } from "../lib/mod.ts";

const edgeCase = "ERC20";

Deno.test(`compile ${edgeCase}`, async () => {
  const { params } = await import("./params.ts");
  await compile(params[edgeCase]);
});
