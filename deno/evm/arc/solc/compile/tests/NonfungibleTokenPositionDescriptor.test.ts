import { compile } from "../lib/mod.ts";

const edgeCase = "NonfungibleTokenPositionDescriptor";

Deno.test(`compile ${edgeCase}`, async () => {
  const { params } = await import("./params.ts");
  await compile(params[edgeCase]);
});
