import { PipedCommand } from "../../../../stdplus/piped-command/lib/mod.ts";
import { Cache } from "../../../../stdplus/cache/lib/mod.ts";
import { List } from "../../list/lib/mod.ts";
import { Release } from "../../release/lib/mod.ts";
import { createSourceMap } from "./_createSourceMap.ts";
import { getEvmVersion } from "./_getEvmVersion.ts";
import { Params } from "../types/Parameters.ts";

export async function compile({
  targets,
  basePath,
  includePaths,
  excludePaths,
  remappings,
  optimizer = { enabled: false, runs: 0 },
  viaIR,
  cacheDir,
  excludeOpcodes,
  solcPath,
}: Params) {
  const requiredSources = Object.keys(targets);
  const sourceMap = await createSourceMap({
    requiredSources,
    basePath,
    includePaths,
    excludePaths,
    remappings,
  });

  let version: string;
  if (!solcPath) {
    cacheDir ??= `${Deno.env.get("HOME")!}/.deno-evm/solc`;
    const cache = new Cache(cacheDir);
    const list = await List.get(cache);
    const codeArray = [...sourceMap.values()];
    const vr = list.maxSatisfying(codeArray);
    version = vr[0];
    const release = vr[1];
    await Release.ensure(release, cache);
    solcPath = `${cacheDir}/${release}`;
  } else {
    const proc = new PipedCommand(solcPath, { args: ["--version"] }).spawn();
    const cmdOut = await proc.output();
    const match = cmdOut.stdoutText.match(/Version: (\d+.\d+.\d+)/)?.[1];
    if (!match) throw new Error("could not get version from given solcPath");
    version = match;
  }

  const language = "Solidity";
  const sources = [...sourceMap.entries()].reduce<
    Record<string, { content: string }>
  >(
    (p, [source, content]) => (p[source] = { content }, p),
    {},
  );
  const evmVersion = getEvmVersion(version, excludeOpcodes);
  const outputSelection = Object.entries(targets).reduce<
    Record<string, Record<string, string[]>>
  >(
    (
      p,
      [source, contracts],
    ) => (p[source] = contracts.reduce<Record<string, string[]>>(
      (
        p,
        contract,
      ) => (p[contract] = [
        "abi",
        "evm.bytecode.object",
        "evm.bytecode.linkReferences",
        "evm.bytecode.opcodes",
      ],
        p),
      { [""]: ["ast"] },
    ),
      p),
    {},
  );
  const settings = {
    remappings,
    optimizer,
    evmVersion,
    outputSelection,
    viaIR,
  };
  const input = { language, sources, settings };
  const inputBytes = new TextEncoder().encode(JSON.stringify(input));

  const proc = new PipedCommand(solcPath, { args: ["--standard-json"] })
    .spawn();
  await proc.writeAndClose(inputBytes);
  const cmdOut = await proc.output();

  if (cmdOut.stderrText) {
    throw new Error("compile error", { cause: cmdOut.stderrText });
  }
  return cmdOut.stdoutText;
}
