import { z } from "zod";
import * as schemas from "schemas/mod.ts";

export type RequestByPosition = z.infer<typeof schemas.request.byPosition>