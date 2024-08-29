type ByIndex = unknown[];
type ByName = Record<string, unknown>;

type ParamsKind =
  | { params: ByIndex; kind: "byIndex" }
  | { params: ByName; kind: "byName" };

export function checkParamsType(
  params: ByIndex | [ByName],
  inputs: Input[],
): ParamsKind {
  if (inputs.length == 1 && inputs[0].type == "tuple") {
    throw new Error(
      "currently unhandled ambiguity: first and only input is a struct",
    );
  }

  const [param] = params;
  if (
    inputs.length == 1 && param instanceof Object && !(param instanceof Array)
  ) {
    return { params: param as unknown as ByName, kind: "byName" };
  } else {
    return { params, kind: "byIndex" };
  }
}
