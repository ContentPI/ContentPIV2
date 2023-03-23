import { describe, expect, it } from 'vitest'
import { waitFor } from '../time'

describe('waitFor', () => {
  it('should resolve after the given time', async () => {
    const start = Date.now()
    await waitFor(1)
    const end = Date.now()
    const difference = end - start
    expect(difference).toBeGreaterThanOrEqual(1000)
  })

  it('should resolve even if time is 0', async () => {
    const start = Date.now()
    await waitFor(0)
    const end = Date.now()
    const difference = end - start
    expect(difference).toBeLessThan(100)
  })
})
