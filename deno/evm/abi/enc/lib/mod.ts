import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { checksum } from "../../../lib/checksum/lib/mod.ts";
import {
    Type,
    TypeKind,
    Types,
    UnknownTuple,
    TupleByIndex,
    TupleByName
} from "../types/mod.ts";



export function typeKind({ id, components }: Type): TypeKind {
  switch (id) {
    case Types.bytes:
    case Types.string:
    case Types.dynamicArray:
      return TypeKind.dynamic;
    case Types.fixedArray:
    case Types.tuple:
      assert(components);
      assert(components.length);
      return components.some(t => typeKind(t) == TypeKind.dynamic)
        ? TypeKind.dynamic : TypeKind.static;
    default:
      return TypeKind.static;
  }
}



export function enc(value: unknown, type: Type): string {
  switch (type.id) {
    case Types.tuple:
      assert(value instanceof Object, "wrong type, expected array or record");
      return encTuple(<UnknownTuple>value, type);
    case Types.fixedArray:
      assert(value instanceof Array, "wrong type, expected array");
      return encFixedArray(<unknown[]>value, type);
    case Types.dynamicArray:
      assert(value instanceof Array, "wrong type, expected array");
      return encDynamicArray(<unknown[]>value, type);
    case Types.bytes:
      assert(typeof value == "string" || value instanceof Uint8Array, "wrong type, expected string or Uint8Array");
      return encBytes(value);
    case Types.string:
      assert(typeof value == "string", "wrong type, expected string");
      return encString(value);
    case Types.uintM:
      assert(typeof value == "bigint" || typeof value == "number", "wrong type, expected bigint or number");
      return encUintM(value);
    case Types.address:
      assert(typeof value == "string", "wrong type, expected string");
      return encAddress(value);
    case Types.intM:
      assert(typeof value == "bigint" || typeof value == "number", "wrong type, expected bigint or number");
      return encIntM(value);
    case Types.bool:
      assert(typeof value == "boolean", "wrong type, expected boolean");
      return encBool(value);
    // case Types.fixedMxN:
    //   return encFixedMxN(value);
    // case Types.ufixedMxN:
    //   return encUfixedMxN(value);
    case Types.bytesM:
      assert(typeof value == "string" || value instanceof Uint8Array, "wrong type, expected string or Uint8Array");
      return encBytesM(value);
    default:
      throw new Error(`unimplemented type: ${type.id}`);
  }
}



export function encTuple(value: UnknownTuple, type: Type): string {
  const tuple = resolveTuple(value, type);

  return encIndexedTuple(tuple, type);
}



export function resolveTuple(
  value: UnknownTuple,
  type: Type,
): TupleByIndex {
  assert(type.components);
  assert(!(type.components.length == 1 && type.components[0].id == Types.tuple));

  return value instanceof Object
    && !(value instanceof Array)
    ? namedTupleToIndexedTuple(<TupleByName>value, type)
    : <TupleByIndex>value;
}



export function namedTupleToIndexedTuple(tuple: TupleByName, type: Type): TupleByIndex {
  const typeComponents = type.components; 
  assert(typeComponents);
  const unmappedTypeComponentNames = new Set(typeComponents.map(c => (assert(c.name) , c.name)));
  const unmappedTupleComponentNames = new Set(Object.keys(tuple));
  const componentMap = new Map<unknown, Type>();

  for (const typeComponent of typeComponents) {
    assert(typeComponent.name)
    if (typeComponent.name in tuple) {
      unmappedTypeComponentNames.delete(typeComponent.name);
      unmappedTupleComponentNames.delete(typeComponent.name);
      const value = tuple[typeComponent.name];
      componentMap.set(value, typeComponent);
    }
  }
  
  assert(!unmappedTypeComponentNames.size, `type names [${[...unmappedTypeComponentNames]}] not in tuple`);
  assert(!unmappedTupleComponentNames.size, `tuple names [${[...unmappedTupleComponentNames]}] not in type`);
  assert(componentMap.size == typeComponents.length, 'duplicate names in type');

  return [...componentMap.keys()];
}



export function encIndexedTuple(tuple: TupleByIndex, type: Type): string {
  const { components } = type;
  assert(components);
  assert(components.length == tuple.length, "tuple length mismatch");

  let heads = "";
  let tails = "";
  for (let i = 0; i < components.length; i++) {
    const iValue = tuple[i];
    const iType = components[i];
    if (typeKind(components[i]) == TypeKind.static) {
      const newHead = enc(iValue, iType);
      const newTail = "";
      heads += newHead;
      tails += newTail;
      console.log({ tuple, newHead, newTail, component: iValue })
    } else {
      const headsLen = tuple.length * 32;
      const tailsLen = tails.length / 2;
      const newHead = enc(headsLen + tailsLen, { id: Types.uintM });
      const newTail = enc(iValue, iType);
      // const tailInit = tuple.slice(i, -1).reduce<string>((p, c, i) => p + enc(c, components[i]), "");
      // const tailLast = enc(componentComponents.slice(-1)[0], componentComponents.slice(-1)[0]);
      // const newHead = enc(components.length * 32 + componentTailInit.length / 2, { id: Types.uintM });
      // const newTail = componentTailInit + componentTailLast;
      heads += newHead;
      tails += newTail;
      console.log({ tuple, newHead, newTail, component: iValue, headsLen, tailsLen })
    }
  }
  return heads + tails;
}



export function encFixedArray(value: unknown[], { underlying, length }: Type): string {
  assert(underlying);
  assert(length);
  assert(value.length == length, "array length mismatch");
  
  const components = value.map(_ => underlying);
  
  return encIndexedTuple(<TupleByIndex>value, { id: Types.tuple, components });
}



export function encDynamicArray(value: unknown[], { underlying }: Type): string {
  assert(underlying);
  
  const k = BigInt(value.length)
  const encK = enc(k, { id: Types.uintM });
  const components = value.map(_ => underlying);

  return encK + encIndexedTuple(<TupleByIndex>value, { id: Types.tuple, components });
}



export function encBytes(value: string | Uint8Array): string {
  if (typeof value == "string") {
    assert(value.match(/^(0x)?([0-9A-Fa-f]{2})+$/), 'invalid bytes string');
    value = value.replace(/^0x/, "");
  } else {
    value = [...value].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  const k = BigInt(value.length / 2);
  const encK = enc(k, { id: Types.uintM });

  return encK + value + "0".repeat(64 - (value.length % 64));
}



export function encString(value: string): string {
  const valueBytes = new TextEncoder().encode(value);

  return encBytes(valueBytes);
}



export function encUintM(value: bigint | number): string {
  if (typeof value == "bigint") {
    assert(value >= 0n && value < 2n ** 256n, 'uint out of range');
  } else {
    assert(Number.isInteger(value));
  };

  return BigInt(value).toString(16).padStart(64, "0");
}



export function encAddress(value: string): string {
  assert(value == checksum(value), "invalid checksum");

  return encUintM(BigInt(value));
}



export function encIntM(value: bigint | number): string {
  if (typeof value == "bigint") {
    assert(value >= -(2n ** 128n) && value < 2n ** 128n, 'int out of range');
  } else {
    assert(Number.isInteger(value));
  }

  if (value < 0n) {
    const mask = (1n << 256n) - 1n;
    value = ((~BigInt(-value) & mask) + 1n) & mask;
  }

  return value.toString(16).padStart(64, "0");
}



export function encBool(value: boolean): string {
  return encUintM(value ? 1n : 0n);
}



export function encBytesM(value: string | Uint8Array): string {
  if (typeof value == "string") {
    assert(value.match(/^(0x)?([0-9A-Fa-f]{2}){1,32}$/), "invalid bytesM string");
    value = value.replace(/^0x/, "");
  }

  if (value instanceof Uint8Array) {
    value = [...value].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  return value.padEnd(64, "0");
}