import { Validated } from './validated'
import { ValidationRule } from './validation.rule'
import { structural } from './index';

export const NOT_A_STRING = 'not.a.string'
export const NOT_A_NUMBER = 'not.a.number'
export const NOT_A_BOOLEAN = 'not.a.boolean'
export const NOT_AN_ARRAY = 'not.an.array'
export const NOT_AN_OBJECT = 'not.an.object'
export type Reason
  = typeof NOT_A_STRING
  | typeof NOT_A_NUMBER
  | typeof NOT_A_BOOLEAN
  | typeof NOT_AN_ARRAY
  | typeof NOT_AN_OBJECT

export type Path = Array<string | number>
export const rootPath: Path = []

export type StructuralError = {
  path: Path,
  reason: Reason
}

export function rootError(reason: Reason): StructuralError {
  return {
    path: rootPath,
    reason
  }
}

export const prepend = (part: string | number) => (error: StructuralError): StructuralError => {
  return {
    path: [part, ...error.path],
    reason: error.reason
  }
}

export const append = (part: string | number) => (error: StructuralError): StructuralError => {
  return {
    path: [...error.path, part],
    reason: error.reason
  }
}

export const isString = new ValidationRule<StructuralError, any, string>(v => {
  return typeof v === 'string'
    ? Validated.ok(v)
    : Validated.error(rootError(NOT_A_STRING))
})

export const isNumber = new ValidationRule<StructuralError, any, number>(v => {
  return typeof v === 'number'
    ? Validated.ok(v)
    : Validated.error(rootError(NOT_A_NUMBER))
})

export const isBoolean = new ValidationRule<StructuralError, any, boolean>(v => {
  return typeof v === 'boolean'
    ? Validated.ok(v)
    : Validated.error(rootError(NOT_A_BOOLEAN))
})

export function isArray<A>(r: ValidationRule<StructuralError, any, A>) {
  return new ValidationRule<StructuralError, any, A[]>(vs => {
    return Array.isArray(vs)
      ? Validated.seq(vs.map((v, i) => r.apply(v).mapError(prepend(i))))
      : Validated.error(rootError(NOT_AN_ARRAY))
  })
}

export type IsObjectArg<O extends object> = {[K in keyof O]: ValidationRule<StructuralError, any, O[K]> }
export function isObject<O extends object>(o: IsObjectArg<O>) {
  return new ValidationRule<StructuralError, any, O>(v => {
    if (typeof v === 'object') {
      type Validateds = {[K in keyof O]: Validated<StructuralError, O[K]>}
      const validateds: Partial<Validateds> = {}
      Object.keys(o).forEach(key => {
        const index = key as keyof O
        validateds[index] = o[index].apply(v[index]).mapError(prepend(key))
      })
      return Validated.combine(validateds as Validateds)
    } else {
      return Validated.error(rootError(NOT_AN_OBJECT))
    }
  })
}
