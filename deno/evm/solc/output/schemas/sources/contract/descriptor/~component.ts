import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import { Component } from "solc/output/types/Component.ts"

export const component: z.ZodType<Component> = z.object({
    name: z.string(),
    type: z.string(),
    components: z.lazy(() => component).array().optional(),
    internalType: z.string().optional()
}).strict()