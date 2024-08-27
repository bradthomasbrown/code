import { fromFileUrl } from 'https://deno.land/std@0.224.0/path/from_file_url.ts';

/**
 * A template tag function that serves as a placeholder for expressions in TypeScript template files.
 * 
 * This function allows the file to be valid TypeScript even if not complete.
 * It processes a template literal that must contain exactly one literal string and no substitutions.
 * The literal string represents the name of the placeholder.
 * 
 * A template library can replace the placeholder by name.
 * 
 * @example
 * // variable foo's type is number
 * const foo = $E<number>`foo`
 *
 * @template T - The type to be asserted as the return type of this placeholder.
 * @param strings - The template strings array.
 * @param values - The values array (should be empty).
 * @returns undefined, asserted as the type T.
 * @throws Error if the template contains more than one literal string or if it contains substitutions.
 */
export function $E<T>(strings: TemplateStringsArray, ...values: string[]): T {
    if (strings.length !== 1) throw new Error('$E expression template must contain exactly one literal string')
    if (values.length) throw new Error('$E expression template must not contain substitutions')
    return undefined as T
}

/**
 * Asserts the type of the first parameter to be returned by this placeholder type.
 * 
 * This type allows the file to be valid TypeScript even if not complete.
 * The first type argument is the type to be asserted.
 * The second type argument is the id of the placeholder.
 *
 * A template library can replace the placeholder by id.
 *
 * @example
 * // type Foo is number
 * type Foo = $T<number, `foo`>
 * 
 * @template T - The type asserted to be returned by this placeholder type.
 * @template Id - The id of the placeholder. It must be a string literal using backticks.
 */
export type $T<T, Id extends string> = Id extends `${infer Literal}` ? T : never;

/**
 * A substitution rule to be applied to a code string.
 * 
 * The rule specifies the type of the placeholder to be replaced and its id.
 * The content of the rule is the replacement string.
 */
export type SubstitutionRule = {
    type: 'expression' | 'type' | 'parameter',
    id: string,
    content: string
}

/**
 * Applies a substitution rule to a code string.
 * 
 * @param code - The code string to apply the rule to.
 * @param rule - The substitution rule to apply.
 * @returns The code string with the rule applied.
 */
function applyRule(code: string, rule: SubstitutionRule): string {
    const { type, id, content } = rule
    switch (type) {
        case 'expression': {
            const expressionString = `\\$E.+?${id}\``
            const expressionRegex = new RegExp(expressionString, 'g')
            return code.replace(expressionRegex, content)
        }
        case 'type': {
            const expressionString = `\\$T.+?${id}\`>`
            const expressionRegex = new RegExp(expressionString, 'g')
            return code.replace(expressionRegex, content)
        }
        case 'parameter': {
            const expressionString = `\\$P.+?${id}\``
            const expressionRegex = new RegExp(expressionString, 'g')
            return code.replace(expressionRegex, content)
        }
        default: throw new Error(`Unknown substitution rule type: ${type}`)
    }
}

/**
 * Substitutes placeholders in a code string using a set of substitution rules.
 *
 * Removes any one-line placeholder imports from the code string.
 * Removes any leading newlines from the code string.
 * 
 * @param code - The code string to apply the rules to.
 * @param rules - The substitution rules to apply.
 * @returns The code string with the rules applied.
 */
export function substitute(code: string, rules: SubstitutionRule[]): string {
    for (const rule of rules) code = applyRule(code, rule)
    code = code.replace(/^import.+?\$[ET].+\n/gm, '')
    code = code.replace(/^\n+/g, '')
    return code
}

/**
 * Generates a code file from a template file using a set of substitution rules.
 * 
 * @param templatePath - The path to the template file.
 * @param substitutionRules - The substitution rules to apply.
 * @param outputPath - The path to write the generated code file to.
 */
export async function generate(templatePath: string, substitutionRules: SubstitutionRule[], outputPath: string): Promise<void> {
    const template = await Deno.readTextFile(templatePath)
    const code = substitute(template, substitutionRules)
    await Deno.writeTextFile(outputPath, code)
}

/**
 * A template class that generates code files from template files.
 */
export class Templar {
    
    dir: string

    constructor(dir: URL | string) {
        this.dir = fromFileUrl(dir)
    }

    generate(templatePath: string, substitutionRules: SubstitutionRule[], outputPath: string): Promise<void> {
        return generate(`${this.dir}/${templatePath}`, substitutionRules, outputPath)
    }

}