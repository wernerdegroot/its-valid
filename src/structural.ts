import { Validated } from "./validated";

export function isString(v: any): Validated<string, string> {
  return typeof v === 'string'
    ? Validated.ok(v)
    : Validated.error('Not a `string`')
}

export function isNumber(v: any): Validated<string, number> {
  return typeof v === 'number'
    ? Validated.ok(v)
    : Validated.error('Not a `number`')
}

export function isBoolean(v: any): Validated<string, boolean> {
  return typeof v === 'boolean'
    ? Validated.ok(v)
    : Validated.error('Not a `boolean`')
}

export function isArray<A>(fn: (v: any) => Validated<string, A>) {
  return (vs: any): Validated<string, A[]> => {
    return Array.isArray(vs)
      ? Validated.seq(vs.map(fn))
      : Validated.error('Not an `Array`')
  }
}

export type IsObjectArg<O extends object> = { [K in keyof O]: (v: any) => Validated<string, O[K]> }
export function isObject<O extends object>(o: IsObjectArg<O>) {
  return (v: any): Validated<string, O> => {
    if (typeof v === 'object') {
      const applied: { [K in keyof O]?: Validated<string, O[K]> } = {}
      Object.keys(o).forEach((key: string) => {
        const index = key as keyof O
        applied[index] = o[index](v[key])
      })
      const allApplied = applied as { [K in keyof O]: Validated<string, O[K]> }
      return Validated.combine(allApplied)
    } else {
      return Validated.error('Not an `object`')
    }
  }
}
