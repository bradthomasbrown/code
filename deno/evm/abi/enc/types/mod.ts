export enum Types {
  uintM,
  intM,
  address,
  bool,
  fixedMxN,
  ufixedMxN,
  bytesM,
  function,
  fixedArray,
  bytes,
  string,
  dynamicArray,
  tuple
}

export enum TypeKind {
  static,
  dynamic
}

export type Type = {
  id: Types;
  components?: Type[],
  name?: string
  underlying?: Type
  length?: number
};

export type TupleByIndex = unknown[];
export type TupleByName = Record<string, unknown>;
export type UnknownTuple = TupleByIndex | TupleByName;