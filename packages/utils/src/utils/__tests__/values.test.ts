import { describe, expect, it } from 'vitest'
import { getEmptyValues, getReferenceTitle, getEntries, getValuesForTable } from '../values'

describe('getEmptyValues', () => {
  it('should return object with empty fields', () => {
    const values = {
      a: 1,
      b: 'foo',
      c: null,
      d: '',
      e: ' '
    }
    const result = getEmptyValues(values, ['c', 'd'])
    expect(result).toEqual({ c: true, d: true })
  })

  it('should return object with all fields empty', () => {
    const values = {
      a: null,
      b: '',
      c: ' ',
      d: '    '
    }
    const result = getEmptyValues(values)
    expect(result).toEqual({ a: true, b: true, c: true, d: true })
  })
})

describe('getReferenceTitle', () => {
  it('should return Unknown if entry has no fields', () => {
    const entry = { id: 1 }
    const result = getReferenceTitle(entry)
    expect(result).toEqual('Unknown')
  })

  it('should return first non-system field value if entry has fields', () => {
    const entry = { id: 1, foo: 'bar', baz: 'qux' }
    const result = getReferenceTitle(entry)
    expect(result).toEqual('bar')
  })

  it('should return Unknown if entry has only system fields', () => {
    const entry = {
      id: 1,
      createdAt: '2022-04-01',
      updatedAt: '2022-04-02',
      status: 'published',
      modelName: 'post'
    }
    const result = getReferenceTitle(entry)
    expect(result).toEqual('Unknown')
  })
})

describe('getEntries', () => {
  it('returns null if data is null', () => {
    expect(getEntries(null)).toBeNull()
  })

  it('excludes updatedAt by default', () => {
    const data = {
      fields: [
        {
          fieldName: 'Name',
          identifier: 'name',
          isSystem: false,
          type: 'Text',
          values: [
            {
              entry: 1,
              value: 'John'
            },
            {
              entry: 2,
              value: 'Jane'
            }
          ]
        },
        {
          fieldName: 'Updated At',
          identifier: 'updatedAt',
          isSystem: true,
          type: 'Datetime'
        }
      ]
    }

    expect(getEntries(data)).toEqual({
      head: ['Name'],
      body: ['name'],
      systemHead: [],
      systemBody: [],
      entries: [{ name: 'John' }, { name: 'Jane' }]
    })
  })

  it('excludes additional fields if specified', () => {
    const data = {
      fields: [
        {
          fieldName: 'Name',
          identifier: 'name',
          isSystem: false,
          type: 'Text',
          values: [
            {
              entry: 1,
              value: 'John'
            },
            {
              entry: 2,
              value: 'Jane'
            }
          ]
        },
        {
          fieldName: 'Created At',
          identifier: 'createdAt',
          isSystem: true,
          type: 'Datetime'
        }
      ]
    }
  })
})
