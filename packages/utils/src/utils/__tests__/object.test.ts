import { describe, expect, it } from 'vitest'
import { parseDebugData, merge } from '../object'

describe('parseDebugData', () => {
  it('should return null if _DEBUG property is not present', () => {
    const input = { key: 'value' }
    const result = parseDebugData(input)
    expect(result).toBeNull()
  })

  it('should parse and return the value of the _DEBUG property', () => {
    const debugData = { key1: 'value1', key2: 'value2' }
    const input = { _DEBUG: JSON.stringify(debugData) }
    const result = parseDebugData(input)
    expect(result).toEqual(debugData)
  })
})

describe('merge', () => {
  it('should merge non-object properties from the updates object into the current object', () => {
    const current = { key1: 'value1', key2: 'value2' }
    const updates = { key3: 'value3', key4: 'value4' }
    const expectedResult = { key1: 'value1', key2: 'value2', key3: 'value3', key4: 'value4' }
    const result = merge(current, updates)
    expect(result).toEqual(expectedResult)
  })

  it('should merge object properties from the updates object into the current object', () => {
    const current = {
      key1: 'value1',
      key2: {
        subkey1: 'subvalue1'
      }
    }

    const updates = {
      key2: {
        subkey2: 'subvalue2'
      },
      key3: 'value3'
    }

    const expectedResult = {
      key1: 'value1',
      key2: {
        subkey1: 'subvalue1',
        subkey2: 'subvalue2'
      },
      key3: 'value3'
    }

    const result = merge(current, updates)
    expect(result).toEqual(expectedResult)
  })
})
