import { describe, expect, it } from 'vitest'
import { cx, classGenerator } from '../cx'

describe('cx', () => {
  it('should join multiple strings and arrays into a single space-separated string', () => {
    const output = cx('class1', ['class3', 'class4'], { class5: true, class6: false }, 'class7')
    expect(output).toBe('class1 class3 class4 class5 class7')
  })

  it('should ignore null, undefined, and false values', () => {
    const output = cx('class1', null, undefined, false, 'class2')
    expect(output).toBe('class1 class2')
  })

  it('should return an empty string if no input is provided', () => {
    const output = cx()
    expect(output).toBe('')
  })
})

describe('classGenerator', () => {
  it('should generate a string with the ccn and data values', () => {
    const attrs = {
      ccn: 'base',
      data: ['modifier1', 'modifier2']
    }
    const output = classGenerator(attrs)
    expect(output).toBe('base base-modifier1 base-modifier2')
  })

  it('should include the className if provided', () => {
    const attrs = {
      ccn: 'base',
      data: ['modifier1', 'modifier2'],
      className: 'custom'
    }
    const output = classGenerator(attrs)
    expect(output).toBe('base base-modifier1 base-modifier2 custom')
  })

  it('should generate a string with only the ccn if data is empty', () => {
    const attrs = {
      ccn: 'base',
      data: []
    }
    const output = classGenerator(attrs)
    expect(output).toBe('base')
  })
})
