export type Validated<E, A> = Valid<E, A> | Invalid<E, A>

export type ErrorOfValidated<V extends Validated<any, any>> = V['errorType']
export type ValueOfValidated<V extends Validated<any, any>> = V['valueType']

export const Validated = {

  ok<E, A>(a: A): Valid<E, A> {
    return new Valid<E, A>(a)
  },

  error<E, A>(error: E): Invalid<E, A> {
    return new Invalid<E, A>([error])
  },

  errors<E, A>(errors: E[]): Invalid<E, A> {
    return new Invalid<E, A>(errors)
  },

  notUndefined<E, A>(value: A | undefined, error: E): Validated<E, A> {
    if (value === undefined) {
      return Validated.error(error)
    } else {
      return Validated.ok(value)
    }
  },

  seq<E, A>(vs: Validated<E, A>[]): Validated<E, A[]> {
    const errors: E[] = []
    const values: A[] = []
    vs.forEach(v => {
      if (v.type === Valid.type) {
        values.push(v.value)
      } else {
        errors.push(...v.errors)
      }
    })

    if (errors.length === 0) {
      return Validated.ok(values)
    } else {
      return Validated.errors(errors)
    }
  },

  combine<O extends { [k: string]: Validated<any, any> }>(o: O): Validated<ErrorOfValidated<O[keyof O]>, { [K in keyof O]: ValueOfValidated<O[K]> }> {
    
    const errors: any[] = []
    const values: { [K in keyof O]?: any } = {}
    Object.keys(o).forEach(key => {
      const validated = o[key]
      if (validated.type === Valid.type) {
        values[key] = validated.value
      } else if (validated.type === Invalid.type) {
        validated.errors.forEach((e: any) => {
          errors.push(e)
        })
      } else {
        const exhaustive: never = validated
        throw exhaustive
      }
    })

    if (errors.length > 0) {
      return new Invalid(errors)
    } else {
      return new Valid(values as any)
    }
  }
}

export class Valid<E, A> {
  static readonly type = 'ok'
  readonly type = Valid.type

  readonly valueType: A = null as any as A
  readonly errorType: E = null as any as E

  constructor(readonly value: A) { }

  isValid(): this is Valid<E, A> {
    return true
  }

  map<B>(fn: (a: A) => B): Validated<E, B> {
    return new Valid<E, B>(fn(this.value))
  }

  mapError<F>(fn: (e: E) => F): Validated<F, A> {
    return new Valid<F, A>(this.value)
  }

  fold<B>(ok: (v: Valid<E, A>) => B, error: (v: Invalid<E, A>) => B): B {
    return ok(this)
  }

  andThen<B>(fn: (a: A) => Validated<E, B>): Validated<E, B> {
    return fn(this.value)
  }
}

export class Invalid<E, A> {
  static readonly type = 'error'
  readonly type = Invalid.type

  readonly valueType: A = null as any as A
  readonly errorType: E = null as any as E

  constructor(readonly errors: E[]) { }

  isValid(): this is Valid<E, A> {
    return false
  }

  map<B>(fn: (a: A) => B): Validated<E, B> {
    return new Invalid<E, B>(this.errors)
  }

  mapError<F>(fn: (e: E) => F): Validated<F, A> {
    return new Invalid<F, A>(this.errors.map(fn))
  }

  fold<B>(ok: (v: Valid<E, A>) => B, error: (v: Invalid<E, A>) => B): B {
    return error(this)
  }

  andThen<B>(fn: (a: A) => Validated<E, B>): Validated<E, B> {
    return Validated.errors(this.errors)
  }
}
