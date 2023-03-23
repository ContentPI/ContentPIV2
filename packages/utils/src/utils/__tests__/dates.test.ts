import { describe, expect, it } from 'vitest'
import dates from '../dates'

describe('dates', () => {
  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      const validDate = '2022-12-01'
      expect(dates.isValidDate(validDate)).toBe(true)
    })

    it('should return false for invalid dates', () => {
      const invalidDate = '2022-13-01'
      expect(dates.isValidDate(invalidDate)).toBe(false)
    })

    it('should return false for empty input', () => {
      expect(dates.isValidDate('')).toBe(false)
    })
  })

  describe('isWeekend', () => {
    it('should return false for non-weekend dates', () => {
      const nonWeekendDate = '2023-03-22'
      expect(dates.isWeekend(nonWeekendDate)).toBe(false)
    })
  })

  describe('getDaysDifference', () => {
    it('should return the correct number of days between two dates', () => {
      const date1 = '2023-03-01'
      const date2 = '2023-03-22'
      const daysDifference = 21
      expect(dates.getDaysDifference(date1, date2)).toBe(daysDifference)
    })
  })

  describe('getTwoDigitsDay', () => {
    it('should return the day with two digits', () => {
      expect(dates.getTwoDigitsDay(9)).toBe('09')
      expect(dates.getTwoDigitsDay(15)).toBe(15)
    })
  })

  describe('getTwoDigitsMonth', () => {
    it('should return the month with two digits', () => {
      expect(dates.getTwoDigitsMonth(8)).toBe('08')
      expect(dates.getTwoDigitsMonth(12)).toBe(12)
    })
  })

  describe('getIsToday', () => {
    it('should return true if the provided date is today', () => {
      const currentDate = new Date()
      const currentDay = currentDate.getDate()
      expect(dates.getIsToday(currentDate, currentDay)).toBe(true)
    })

    it('should return false if the provided date is not today', () => {
      const currentDate = new Date('2023-03-01')
      const currentDay = currentDate.getDate()
      expect(dates.getIsToday(currentDate, currentDay)).toBe(false)
    })
  })

  describe('getExistingEvents', () => {
    const events = [
      {
        startDate: '2023-03-01',
        endDate: '2023-03-05'
      },
      {
        startDate: '2023-03-10',
        endDate: '2023-03-15'
      }
    ]

    it('should return events that exist within the specified date range', () => {
      const initialDate = new Date('2023-03-03').getTime()
      const existingEvents = dates.getExistingEvents(events, initialDate)
      expect(existingEvents.length).toBe(1)
      expect(existingEvents[0]).toEqual(events[0])
    })

    it('should return an empty array if no events exist within the specified date range', () => {
      const initialDate = new Date('2023-03-07').getTime()
      const existingEvents = dates.getExistingEvents(events, initialDate)
      expect(existingEvents.length).toBe(0)
    })
  })

  describe('months', () => {
    it('should be an array of month names', () => {
      expect(Array.isArray(dates.months)).toBe(true)
      expect(dates.months[0]).toBe('January')
      expect(dates.months[11]).toBe('December')
    })
  })

  describe('days', () => {
    it('should be an array of day names', () => {
      expect(Array.isArray(dates.days)).toBe(true)
      expect(dates.days[0]).toBe('Sunday')
      expect(dates.days[6]).toBe('Saturday')
    })
  })
})
