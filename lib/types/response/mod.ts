import { z } from "zod";
import * as schemas from "schemas/mod.ts";

export type Response = z.infer<typeof schemas.response>