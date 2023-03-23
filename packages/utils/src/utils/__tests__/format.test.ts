import { describe, expect, it } from 'vitest'
import format from '../format'
import currencyFormatter from 'currency-formatter'

describe('format', () => {
  it('should format a number as money with the default currency', () => {
    const amount = 1234.56
    const expectedResult = currencyFormatter.format(amount, { code: 'MXN' })
    const result = format.money(amount)

    expect(result).toBe(expectedResult)
  })

  it('should format a number as money with a specified currency', () => {
    const amount = 1234.56
    const currency = 'USD'
    const expectedResult = currencyFormatter.format(amount, { code: currency })
    const result = format.money(amount, currency)

    expect(result).toBe(expectedResult)
  })

  it('should format zero correctly', () => {
    const amount = 0
    const expectedResult = currencyFormatter.format(amount, { code: 'MXN' })
    const result = format.money(amount)

    expect(result).toBe(expectedResult)
  })
})
