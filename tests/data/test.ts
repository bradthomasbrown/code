import * as jra from '../../lib/mod.ts'

const init:RequestInit = { }
const request = new Request('http://foo', init)
const foo = await jra.Server.extract(request)
if (!(foo instanceof Response)) { console.log(foo); Deno.exit() }
const json = await foo.json()
console.log(json)