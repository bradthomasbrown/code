import { keccak } from "../../keccak.ts";

export function checksum(address: string): string {
  if (!address.match(/^0x[0-9A-Fa-f]{40}$/)) {
    throw new Error(`invalid address string: ${address}`);
  }

  address = address.slice(2).toLowerCase();

  const hash = keccak(address);
  return Array.from(address).reduce(
    (ret, char, i) =>
      ret + (parseInt(hash[i], 16) >= 8 ? char.toUpperCase() : char),
    "0x",
  );
}
