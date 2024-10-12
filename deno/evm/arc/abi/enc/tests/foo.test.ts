import { checksum } from "../../../lib/checksum/lib/mod.ts";
import { enc } from "../lib/mod.ts";
import { Types } from "../types/mod.ts";

console.log(enc({
    foo: "bar",
    bar: [1, 3, 5, 7, 9],
    boo: true
},
    { id: Types.tuple, components: [
        { name: 'foo', id: Types.string },
        { name: 'bar', id: Types.dynamicArray, underlying: { id: Types.uintM } },
        { name: 'boo', id: Types.bool }
    ]
}));

