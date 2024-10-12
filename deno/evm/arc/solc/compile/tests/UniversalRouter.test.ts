import { compile } from "../lib/mod.ts";

const edgeCase = "UniversalRouter";

Deno.test(`compile ${edgeCase}`, async () => {
  const { params } = await import("./params.ts");
  await compile(params[edgeCase]);
});
