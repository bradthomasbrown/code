import { $E, $T } from "../../../../stdplus/templar/lib/mod.ts";
import { descriptor } from "./descriptor.ts";

type ByIndex = $T<unknown[], `ByIndex`>;
type ByName = $T<Record<string, unknown>, `ByName`>;

export function encode($P: ByIndex & `paramsByIndex`): string;
export function encode($P: ByName & `paramsByName`): string;
export function encode(...params: ByIndex | [ByName]): string;
export function encode(...params: ByIndex | [ByName]): string {
  const paramsType = checkParamsType(params);
  if (paramsType.type == "byIndex") {
    return encodeByIndex(paramsType.params);
  } else {
    return encodeByName(paramsType.params);
  }
}
