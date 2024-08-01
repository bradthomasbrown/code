import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

const baseAbiInputObject = z.object({
    name: z.string(),
    type: z.string(),
    internalType: z.string()
})

type AbiInputObject = z.infer<typeof baseAbiInputObject> & {
    components?: AbiInputObject[]
}

export const abiInputObject:z.ZodType<AbiInputObject> = baseAbiInputObject.extend({
    components: z.lazy(() => abiInputObject.array().optional())
})