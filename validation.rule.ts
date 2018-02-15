import { Validated } from "./index";

export type ErrorOfValidationRule<V extends ValidationRule<any, any, any>> = V['errorType']
export type InputOfValidationRule<V extends ValidationRule<any, any, any>> = V['inputType']
export type OutputOfValidationRule<V extends ValidationRule<any, any, any>> = V['outputType']

export class ValidationRule<E, A, B> {

  readonly inputType: A = null as any as A
  readonly outputType: B = null as any as B
  readonly errorType: E = null as any as E

  constructor(private readonly fn: (a: A) => Validated<E, B>) { }

  apply(a: A): Validated<E, B> {
    return this.fn(a)
  }

  static combine<O extends { [k: string]: ValidationRule<any, any, any> }>(o: O): ValidationRule<ErrorOfValidationRule<O[keyof O]>, {[K in keyof O]: InputOfValidationRule<O[K]>}, {[K in keyof O]: OutputOfValidationRule<O[K]>}> {
    return new ValidationRule(a => {
      type Validateds = {[K in keyof O]: Validated<ErrorOfValidationRule<O[keyof O]>, OutputOfValidationRule<O[K]>>}
      const validateds: Partial<Validateds> = {}
      Object.keys(o).forEach(key => {
        const index = key as keyof O
        validateds[index] = o[index].apply(a[index])
      })
      return Validated.combine(validateds as Validateds)
    })
  }
}
