import { isObject, isString, isNumber, isBoolean, isArray, StructuralError, rootError, rootPath, NOT_A_STRING, NOT_A_NUMBER, NOT_A_BOOLEAN, prepend, NOT_AN_ARRAY, NOT_AN_OBJECT, append } from "./structural";
import { Validated } from "./index";

describe('isString', () => {
  it('should be able to verify that something is a string', () => {
    const str = 'Hank'
    const expected = Validated.ok<StructuralError, string>(str)
    expect(isString.apply(str as any)).toEqual(expected)
  })

  it('should be able to determine that something is not a string', () => {
    const notStr = 13
    const expected = Validated.error<StructuralError, string>(rootError(NOT_A_STRING))
    expect(isString.apply(notStr as any)).toEqual(expected)
  })
})

describe('isNumber', () => {
  it('should be able to verify that something is a number', () => {
    const num = 3
    const expected = Validated.ok<StructuralError, number>(num)
    expect(isNumber.apply(num as any)).toEqual(expected)
  })

  it('should be able to determine that something is not a number', () => {
    const notNum = 'Twelve'
    const expected = Validated.error<StructuralError, number>(rootError(NOT_A_NUMBER))
    expect(isNumber.apply(notNum as any)).toEqual(expected)
  })
})

describe('isBoolean', () => {
  it('should be able to verify that something is a number', () => {
    const bool = false
    const expected = Validated.ok<StructuralError, boolean>(bool)
    expect(isBoolean.apply(bool as any)).toEqual(expected)
  })

  it('should be able to determine that something is not a number', () => {
    const notBool = 8
    const expected = Validated.error<StructuralError, number>(rootError(NOT_A_BOOLEAN))
    expect(isBoolean.apply(notBool as any)).toEqual(expected)
  })
})

describe('isArray', () => {
  const isArrayOfNumbers = isArray(isNumber)

  it('should be able to verify that something is an array with the expected elements', () => {
    const arr = [4, 3, 9]

    const expected = Validated.ok<StructuralError, number[]>(arr)
    expect(isArrayOfNumbers.apply(arr as any)).toEqual(expected)
  })

  it('should be able to verify that something is an array but has unexpected elements', () => {
    const arr = [4, 'Three', 'Nine']

    const expected = Validated.errors<StructuralError, number[]>([
      append(1)(rootError(NOT_A_NUMBER)), 
      append(2)(rootError(NOT_A_NUMBER))
    ])
    expect(isArrayOfNumbers.apply(arr as any)).toEqual(expected)
  })

  it('should be able to verify that something is not an array', () => {
    const notArr = '4, 3, 9'

    const expected = Validated.error<StructuralError, number[]>(rootError(NOT_AN_ARRAY))
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

    const expected = Validated.ok<StructuralError, Person>(obj)
    expect(isPerson.apply(obj as any)).toEqual(expected)
  })

  it('should be able to determine that something is an object but doesn\'t have the right shape', () => {
    const obj = {
      name: 14,
      age: 'Morty',
      driversLicense: false
    }

    const expected = Validated.errors<StructuralError, Person>([
      append('name')(rootError(NOT_A_STRING)),
      append('age')(rootError(NOT_A_NUMBER))
    ])
    expect(isPerson.apply(obj as any)).toEqual(expected)
  })

  it('should be able to determine that something is not an object', () => {
    const notObj = 4

    const expected = Validated.error<StructuralError, Person>(rootError(NOT_AN_OBJECT))
    expect(isPerson.apply(notObj as any)).toEqual(expected)
  })
})