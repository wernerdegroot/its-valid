import { Validated } from "./validated";
import { ValidationRule } from "./validation.rule";

export const isString = new ValidationRule<string, any, string>(v => {
  return typeof v === 'string'
    ? Validated.ok(v)
    : Validated.error('Not a `string`')
})

export const isNumber = new ValidationRule<string, any, number>(v => {
  return typeof v === 'number'
    ? Validated.ok(v)
    : Validated.error('Not a `number`')
})

export const isBoolean = new ValidationRule<string, any, boolean>(v => {
  return typeof v === 'boolean'
    ? Validated.ok(v)
    : Validated.error('Not a `boolean`')
})

export function isArray<A>(r: ValidationRule<string, any, A>) {
  return new ValidationRule<string, any, A[]>(vs => {
    return Array.isArray(vs)
      ? Validated.seq(vs.map(v => r.apply(v)))
      : Validated.error('Not an `Array`')
  })
}

export type IsObjectArg<O extends object> = { [K in keyof O]: ValidationRule<string, any, O[K]> }
export function isObject<O extends object>(o: IsObjectArg<O>) {
  return new ValidationRule<string, any, O>(v => {
    if (typeof v === 'object') {
      return ValidationRule.combine(o).apply(v)
    } else {
      return Validated.error('Not an `object`')
    }
  })
}
