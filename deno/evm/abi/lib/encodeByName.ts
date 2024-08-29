import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { Input } from "../types/mod.ts";
import { toChecksummed } from "./toChecksummed.ts";
import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";

export function encodeByName(
  params: Record<string, unknown>,
  inputs: Input[],
): string {
  const paramInputMap = new Map<unknown, Input>();
  const unmappedInputs = new Set(inputs.map((i) => i.name));
  const unmappedParams = new Set(Object.keys(params));
  for (const input of inputs) {
    const value = params[input.name];
    paramInputMap.set(value, input);
    unmappedInputs.delete(input.name);
    unmappedParams.delete(input.name);
    paramInputMap.set(params[input.name], input);
  }

  if (unmappedParams.size) {
    throw new Error(`unmapped params: ${[...unmappedParams].join(", ")}`);
  }
  if (unmappedInputs.size) {
    throw new Error(`unmapped inputs: ${[...unmappedInputs].join(", ")}`);
  }
  if (paramInputMap.size != inputs.length) {
    throw new Error("mapping not one-to-one");
  }

  return enc(Object.values(params), "tuple");
  // for (const [value, { name, type: targetType }] of paramInputMap)
  // {

  //     const givenType = typeof value
  //     switch (typeof value)
  //     {
  //     case 'string':
  //         if (targetType == 'address')
  //         {
  //             assertEquals(value, toChecksummed(value), 'address not checksummed')
  //             return enc(BigInt(value), 'uint')
  //         }
  //         else
  //             throw new Error(`unhandled targetType ${targetType} for givenType ${givenType} for input ${name}`)
  //     default:
  //         throw new Error(`unhandled givenType ${givenType} for input ${name}`)
  //     }
  // }
}

function enc(value: unknown, type: string): string {
  let typeKind: "static" | "dynamic";
  switch (type) {
    case "bytes":
      typeKind = "dynamic";
  }

  switch (type) {
    case "tuple": {
      assert(value instanceof Array);
      return [
        value.map((v) => head(v)).join(""),
        value.map((v) => tail(v)).join(""),
      ].join("");
    }
    case "uint": {
      assert(typeof value == "bigint" || typeof value == "number");
      if (typeof value == "number") {
        assert(Number.isInteger(value));
      }
      assert(value >= 0);
      return value.toString(16).padStart(64, "0");
    }
    case "int": {
      assert(typeof value == "bigint" || typeof value == "number");
      if (typeof value == "number") {
        assert(Number.isInteger(value));
      }
      if (value < 0) {
        const mask = (1n << 256n) - 1n;
        const twosComplement = ((~BigInt(value) & mask) + 1n) & mask;
        return twosComplement.toString(16).padStart(64, "f");
      } else return value.toString(16).padStart(64, "0");
    }
    default:
      throw new Error(`unhandled enc type ${type}`);
  }
}
