import { Cache } from "../../../../stdplus/cache/lib/mod.ts";

export class Release {
  static async ensure(release: string, cache: Cache) {
    const path = release;
    const retrieve = () =>
      fetch(`https://binaries.soliditylang.org/linux-amd64/${release}`)
        .then((response) => response.blob())
        .then((blob) => cache.writeFile(path, blob.stream(), { mode: 0o755 }));
    await cache.ensure({ path, retrieve });
  }
}
