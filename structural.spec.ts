import { isObject, isString, isNumber, isBoolean, isArray } from "./structural";
import { Validated } from "./index";

describe('isString', () => {
  it('should be able to verify that something is a string', () => {
    const str = 'Hank'
    const expected = Validated.ok<string, string>(str)
    expect(isString.apply(str as any)).toEqual(expected)
  })

  it('should be able to determine that something is not a string', () => {
    const notStr = 13
    const expected = Validated.errors<string, string>(['Not a `string`'])
    expect(isString.apply(notStr as any)).toEqual(expected)
  })
})

describe('isNumber', () => {
  it('should be able to verify that something is a number', () => {
    const num = 3
    const expected = Validated.ok<string, number>(num)
    expect(isNumber.apply(num as any)).toEqual(expected)
  })

  it('should be able to determine that something is not a number', () => {
    const notNum = 'Twelve'
    const expected = Validated.errors<string, number>(['Not a `number`'])
    expect(isNumber.apply(notNum as any)).toEqual(expected)
  })
})

describe('isBoolean', () => {
  it('should be able to verify that something is a number', () => {
    const bool = false
    const expected = Validated.ok<string, boolean>(bool)
    expect(isBoolean.apply(bool as any)).toEqual(expected)
  })

  it('should be able to determine that something is not a number', () => {
    const notBool = 8
    const expected = Validated.errors<string, number>(['Not a `boolean`'])
    expect(isBoolean.apply(notBool as any)).toEqual(expected)
  })
})

describe('isArray', () => {
  const isArrayOfNumbers = isArray(isNumber)

  it('should be able to verify that something is an array with the expected elements', () => {
    const arr = [4, 3, 9]

    const expected = Validated.ok<string, number[]>(arr)
    expect(isArrayOfNumbers.apply(arr as any)).toEqual(expected)
  })

  it('should be able to verify that something is an array but has unexpected elements', () => {
    const arr = [4, 'Three', 'Nine']

    const expected = Validated.errors<string, number[]>(['Not a `number`', 'Not a `number`'])
    expect(isArrayOfNumbers.apply(arr as any)).toEqual(expected)
  })

  it('should be able to verify that something is not an array', () => {
    const notArr = '4, 3, 9'

    const expected = Validated.errors<string, number[]>(['Not an `Array`'])
    expect(isArrayOfNumbers.apply(notArr as any)).toEqual(expected)
  })
})

describe('isObject', () => {

  type Person = {
    name: string,
    age: number,
    driversLicense: boolean
  }

  const isPerson = isObject({
    name: isString,
    age: isNumber,
    driversLicense: isBoolean
  })

  it('should be able to verify that something is an object of the expected shape', () => {
    const obj = {
      name: 'Morty',
      age: 14,
      driversLicense: false
    }

    const expected = Validated.ok<string, Person>(obj)
    expect(isPerson.apply(obj as any)).toEqual(expected)
  })

  it('should be able to determine that something is an object but doesn\'t have the right shape', () => {
    const obj = {
      name: 14,
      age: 'Morty',
      driversLicense: false
    }

    const expected = Validated.errors<string, Person>([
      'Not a `string`',
      'Not a `number`'
    ])
    expect(isPerson.apply(obj as any)).toEqual(expected)
  })

  it('should be able to determine that something is not an object', () => {
    const notObj = 4

    const expected = Validated.errors<string, Person>([
      'Not an `object`'
    ])
    expect(isPerson.apply(notObj as any)).toEqual(expected)
  })
})