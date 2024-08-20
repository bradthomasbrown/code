import { zipWith } from './zipWith.ts';

export const zipAppendTemplateStringArrays = (xs: TemplateStringsArray, ys: TemplateStringsArray) => {
  return Object.assign(
    zipWith((x, y) => x + y, xs, ys),
    { raw: zipWith((x, y) => x + y, xs.raw, ys.raw) })
}