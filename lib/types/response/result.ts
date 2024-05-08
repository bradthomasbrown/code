import { z } from "zod";
import * as schemas from "schemas/mod.ts";

export type ResultResponse = z.infer<typeof schemas.response.result>