import { Docker } from "../Docker.ts";

const id = await Docker.run('hello-world')
console.log(id)