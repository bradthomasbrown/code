import { LinkReferences } from 'solc/output/types/LinkReferences.ts'
import { Descriptors } from "generate/input/types/Descriptors/mod.ts"

export type Contract = {
    bytecode?: string
    linkReferences?: LinkReferences
    descriptors: Descriptors
}