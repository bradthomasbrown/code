// export * from "./Output.ts";
// export * from "./Source.ts";
// export * from "./Contract.ts";
// export * from "../../../abi/types/Descriptor/mod.ts";
// export * from "./Component.ts";
// export * from "./Sources.ts";
// export * from "./LinkReferences.ts";
// export * from "./Descriptors.ts";
// export * from "./Offsets.ts";

// export type { Source as Contracts } from "./Source.ts";

import { Sources as Contracts } from "./Contract/mod.ts";

export type Output = Readonly<Partial<{
    errors: unknown;
    sources: unknown;
    contracts: Contracts;
}>>