import { z } from "zod";
import * as schemas from "schemas/mod.ts";

export type RequestByName = z.infer<typeof schemas.request.byName>