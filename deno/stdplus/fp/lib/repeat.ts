export function* repeat<X>(x: X): Generator<X> {
  while (true) yield x;
}