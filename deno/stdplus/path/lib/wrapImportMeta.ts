import { fromFileUrl } from "https://deno.land/std@0.224.0/path/from_file_url.ts";
import { resolve } from "https://deno.land/std@0.224.0/path/resolve.ts";
import { zipAppendTemplateStringArrays } from '../../list/lib/zipAppendTemplateStringArrays.ts';

// i - ImportMeta
// p [P] - PathToResolve [TemplateStringsArray]
// r [R] - RelativePath [TemplateStringsArray]
// f - RelativeFromResolvedPath

function iPR_f(i: ImportMeta, P: TemplateStringsArray, R: TemplateStringsArray) {
  const [p] = P
  const [r] = R
  return resolve(fromFileUrl(i.resolve(p)), r)
}

function iP_R_f(i: ImportMeta, P: TemplateStringsArray) {
  const R_f = (R: TemplateStringsArray) => iPR_f(i, P, R)
  return R_f
}

function iP_j(i: ImportMeta, P: TemplateStringsArray) {
  const /**R_j**/cd = (R: TemplateStringsArray | string) => iP_j(i, zipAppendTemplateStringArrays(P, typeof R == 'string' ? Object.assign([R], { raw: [R] }) : R))
  function resolve(path: string) { return iPR_f(i, P, Object.assign([path], { raw: [path] })) }
  const j = Object.assign(iP_R_f(i, P), { /**R_j**/cd }, { resolve })
  return j
}

export function /**i_P_j**/wrapImportMeta(i: ImportMeta) {
  const P_j = (P: TemplateStringsArray) => iP_j(i, P)
  function baseResolver(base: string) { return P_j(Object.assign([base], { raw: [base] })) }
  return Object.assign(P_j, i, { baseResolver })
}