import { resolve } from 'https://deno.land/std@0.224.0/path/resolve.ts';
import { Cache } from 'std/cache/Cache.ts';

const root = resolve(import.meta.dirname!, '..')
export const cache = new Cache(root)