import { z } from "zod";
import * as schemas from "schemas/mod.ts";

export type Request = z.infer<typeof schemas.request>