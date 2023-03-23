import { describe, expect, it } from 'vitest'
import is from '../is'

describe('#is.Array', () => {
  it('should return true if is an Array', () => {
    expect(is.Array([1, 2, 3])).toBe(true)
  })

  it('should return false if is not an Array', () => {
    expect(
      is.Array({
        bar: 'bar',
        foo: 'foo'
      })
    ).toBe(false)
  })
})

describe('#is.Defined', () => {
  it('should return true if a variable is defined', () => {
    const test = 'Foo'
    expect(is.Defined(test)).toBe(true)
  })

  it('should return false if a variable is undefined', () => {
    let test
    expect(is.Defined(test)).toBe(false)
  })
})

describe('#is.Function', () => {
  it('should be true if a variable is a function', () => {
    const test = (): string => 'bar'
    expect(is.Function(test)).toBe(true)
  })

  it('should be false if a variable is not a function', () => {
    const test = 'bar'
    expect(is.Function(test)).toBe(false)
  })
})

describe('#is.JSON', () => {
  it('should be true if a variable is a valid json', () => {
    const test = JSON.stringify({
      foo: {
        bar: true
      }
    })

    expect(is.JSON(test)).toBe(true)
  })

  it('should be false if a variable is not a valid json', () => {
    expect(is.JSON('')).toBe(false)
    expect(is.JSON('bar')).toBe(false)
  })
})

describe('#is.Number', () => {
  it('should be true if a variable is a number', () => {
    expect(is.Number(-1)).toBe(true)
    expect(is.Number(0)).toBe(true)
    expect(is.Number(1)).toBe(true)
  })

  it('should be false if a variable is not a number', () => {
    expect(is.Number(true)).toBe(false)
    expect(is.Number(false)).toBe(false)
    expect(is.Number('O')).toBe(false)
  })
})

describe('#is.Object', () => {
  it('should return true if a variable is object', () => {
    const test = {
      foo: 'Foo'
    }

    expect(is.Object(test)).toBe(true)
  })

  it('should return false if a variable is not an object', () => {
    const test = ['Foo']
    expect(is.Object(test)).toBe(false)
  })
})

describe('#is.Password', () => {
  it('should be true if a value is a valid password', () => {
    expect(is.Password('12345678')).toBe(true)
  })

  it('should be true if a value is not a valid password', () => {
    expect(is.Password('12345')).toBe(false)
  })
})

describe('#is.String', () => {
  it('should be true if a variable is a string', () => {
    expect(is.String('foo')).toBe(true)
    expect(is.String('123')).toBe(true)
    expect(is.String('true')).toBe(true)
  })

  it('should be false if a variable is not a string', () => {
    expect(is.String(true)).toBe(false)
    expect(is.String(false)).toBe(false)
    expect(is.String(0)).toBe(false)
    expect(is.String(1)).toBe(false)
  })
})

describe('#is.Undefined', () => {
  it('should return true if a variable is undefined', () => {
    let test
    expect(is.Undefined(test)).toBe(true)
  })

  it('should return false if a variable is not undefined', () => {
    const test = 'foo'
    expect(is.Undefined(test)).toBe(false)
  })
})

describe('#is.EmptyObject', () => {
  it('should return true if object is empty', () => {
    const obj = {}
    expect(is.EmptyObject(obj)).toBe(true)
    expect(is.EmptyObject(undefined)).toBe(true)
  })

  it('should return false if object is not empty', () => {
    const obj = {
      foo: 'bar'
    }
    expect(is.EmptyObject(obj)).toBe(false)
  })
})

describe('#is.Language', () => {
  it('should return true if is a valid language', () => {
    expect(is.Language('en-US')).toBe(true)
  })

  it('should return false if is not a valid language', () => {
    expect(is.Language('bn-IN')).toBe(false)
  })
})
