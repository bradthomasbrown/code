import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Client } from '../../lib/mod.ts'

const client = new Client('http://api')

Deno.test('parsable response', async () => {
    const result = await client.request('foo_bar', { bar: 'baz'}, 0).catch((e:Error) => e)
    assertEquals(result instanceof Error, false)
})

Deno.test('parse error', async () => {
    //@ts-ignore testing for error
    const result = await client.request('foo_bar', false, 0).catch((e:Error) => e)
    assertEquals(result instanceof Error, true)
    if (!(result instanceof Error)) throw new Error()
    assertEquals(result.message, '-32700: Parse error.')
})