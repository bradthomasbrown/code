// roughly: https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:zipWith

export function zipWith<A, B, C>(f: (x: A, y: B) => C, xs: readonly A[], ys: readonly B[]): C[] {
    function go(xs: readonly A[], ys: readonly B[]): C[] {
        if (!xs.length) return []
        if (!ys.length) return []
        const [x, ..._xs] = xs
        const [y, ..._ys] = ys
        return [f(x, y), ...go(_xs, _ys)]
    }
    return go(xs, ys)
}