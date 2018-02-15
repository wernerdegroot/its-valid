# its-valid
It's valid! - Typescript validators

## Introduction

### Validated values
`its-valid` revolves around two simple primitives
* a *validated value* `Validated<ErrorType, ValueType>` is either valid or invalid
    
    ```typescript
    import { Validated } from 'its-valid'

    const valid = Validated.ok(99)
    const notValid = Validated.error('Not 99')
    ```

* a *validation rule* is a function from a value of type `A` to a validated value of type `Validated<ErrorType, B>` and proves something about your value of type `A`
    
    ```typescript
    import { Validated, ValidationRule } from 'its-valid'

    // Returns the first value of an array (if it exists)
    const firstValue: ValidationRule<number[], string, number> = (ns: number[]) => {
      if (v.length > 0) {
        return Validated.ok(v[0])
      } else {
        return Validated.error('Array is empty')
      }
    }
    ```

There can be many reasons why a certain value is not valid. When checking a `Person`, for instance, we want to verify that each field is valid:

```typescript
type Person = {
  name: string,
  age: number,
  hasDriversLicense: boolean
}

const validatedPerson = Validated.combine({
  name: Validated.error<string, string>('Not a valid name'),
  age: Validated.ok<Error, number>(new Error()),
  hasDriversLicense: Validated.ok<string, boolean>(true)
})
```

Type inference works well enough that Typescript can figure out that `validatedPerson` is a `Validated<string | Error, Person>`.

### Check the structure of an object
