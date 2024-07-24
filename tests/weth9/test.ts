import { Docker } from "../../Docker.ts";

const foo = await Docker.exec('weth9')
console.log(foo)