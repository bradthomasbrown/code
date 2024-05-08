import { z } from "zod";

export const base = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  id: z.string().or(z.number()).or(z.null()),
});