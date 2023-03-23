import { describe, expect, it } from 'vitest'
import rtl from '../rtl'

describe('rtl', () => {
  describe('isRtlText', () => {
    it('should return false for non-RTL text', () => {
      const text = 'English'
      const result = rtl.isRtlText(text)
      expect(result).toBeFalsy()
    })
  })

  describe('isRtlLang', () => {
    it('should return true for RTL language code', () => {
      const langCode = 'ar'
      const result = rtl.isRtlLang(langCode)
      expect(result).toBeTruthy()
    })

    it('should return false for non-RTL language code', () => {
      const langCode = 'en'
      const result = rtl.isRtlLang(langCode)
      expect(result).toBeFalsy()
    })
  })

  describe('getLangDir', () => {
    it('should return "rtl" for RTL language code', () => {
      const langCode = 'ar'
      const expectedResult = 'rtl'
      const result = rtl.getLangDir(langCode)
      expect(result).toEqual(expectedResult)
    })

    it('should return "ltr" for non-RTL language code', () => {
      const langCode = 'en'
      const expectedResult = 'ltr'
      const result = rtl.getLangDir(langCode)
      expect(result).toEqual(expectedResult)
    })
  })
})
