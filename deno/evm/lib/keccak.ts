import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

export function keccak(data: string): string {
  const dataBytes = new TextEncoder().encode(data);
  const buffer = crypto.subtle.digestSync("KECCAK-256", dataBytes);
  const digestBytes = new Uint8Array(buffer);
  return [...digestBytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
