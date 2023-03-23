import { describe, expect, it } from 'vitest'
import cookies from '../cookies'

describe('cookies', () => {
  describe('get', () => {
    it('should return the value of the specified cookie', () => {
      const cookieName = 'testCookie'
      const cookieValue = 'testValue'
      const cookiesStr = `otherCookie=otherValue; ${cookieName}=${cookieValue}; anotherCookie=anotherValue`
      const output = cookies.get(cookieName, cookiesStr)
      expect(output).toBe(cookieValue)
    })

    it('should return null if the specified cookie is not found', () => {
      const cookieName = 'nonexistentCookie'
      const cookiesStr = 'otherCookie=otherValue; anotherCookie=anotherValue'
      const output = cookies.get(cookieName, cookiesStr)
      expect(output).toBeNull()
    })

    it('should return null if the cookies string is empty', () => {
      const cookieName = 'testCookie'
      const cookiesStr = ''
      const output = cookies.get(cookieName, cookiesStr)
      expect(output).toBeNull()
    })

    it('should return null if the cookies string is null', () => {
      const cookieName = 'testCookie'
      const cookiesStr = null
      const output = cookies.get(cookieName, cookiesStr)
      expect(output).toBeNull()
    })
  })
})
