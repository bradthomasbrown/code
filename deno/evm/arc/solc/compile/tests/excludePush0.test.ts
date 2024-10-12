import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { compile } from "../lib/mod.ts";
import { params } from "./params.ts";

Deno.test("compile ERC20 exclude PUSH0", async () => {
  const results = await compile({
    ...params["ERC20"],
    excludeOpcodes: ["PUSH0"],
  });
  const push0Match = JSON.parse(results).contracts["ERC20.sol"]["ERC20"].evm
    .bytecode.opcodes.match(/PUSH0/);
  assert(!push0Match);
});

Deno.test("compile Resolver exclude PUSH0", async () => {
  const results = await compile({
    ...params["Resolver"],
    excludeOpcodes: ["PUSH0"],
  });
  const push0Match = JSON.parse(results).contracts["Resolver.sol"]["Resolver"]
    .evm.bytecode.opcodes.match(/PUSH0/);
  assert(!push0Match);
});

Deno.test("compile UniversalRouter exclude PUSH0", async () => {
  const results = await compile({
    ...params["UniversalRouter"],
    excludeOpcodes: ["PUSH0"],
  });
  const push0Match = JSON.parse(results)
    .contracts["UniversalRouter.sol"]["UniversalRouter"].evm.bytecode.opcodes
    .match(/PUSH0/);
  assert(!push0Match);
});
