import { z } from "zod";

export const base = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.string().or(z.number()).or(z.null()),
});