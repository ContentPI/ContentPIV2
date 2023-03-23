import { describe, expect, it } from 'vitest'
import { googleContactIdToUUID, uuidToGoogleContactId, isUUID } from '../uuid'

describe('googleContactIdToUUID', () => {
  it('converts a 15-character Google Contact ID to UUID format', () => {
    const contactId = 'c7dcab78a2d49c0'
    const uuid = googleContactIdToUUID(contactId)
    expect(uuid).toEqual('00000000-0000-0000-0c7d-cab78a2d49c0')
  })

  it('converts a 16-character Google Contact ID to UUID format', () => {
    const contactId = '18d5a46c88196fb1'
    const uuid = googleContactIdToUUID(contactId)
    expect(uuid).toEqual('00000000-0000-0000-18d5-a46c88196fb1')
  })
})

describe('uuidToGoogleContactId', () => {
  it('converts a UUID to Google Contact ID format', () => {
    const uuid = '00000000-0000-0000-0c7d-cab78a2d49c0'
    const contactId = uuidToGoogleContactId(uuid)
    expect(contactId).toEqual('c7dcab78a2d49c0')
  })
})

describe('isUUID', () => {
  it('returns true for valid UUIDs', () => {
    const uuid1 = '00000000-0000-0000-0000-000000000000'
    const uuid2 = 'f3e2e163-2a8b-4e2a-90cc-7f1b4c9991a4'
    expect(isUUID(uuid1)).toBe(true)
    expect(isUUID(uuid2)).toBe(true)
  })

  it('returns false for invalid UUIDs', () => {
    const uuid1 = ''
    const uuid2 = '00000000-0000-0000-0000-00000000000'
    const uuid3 = 'f3e2e163-2a8b-4e2a-90cc-7f1b4c9991a'
    const uuid4 = 'f3e2e163-2a8b-4e2a-90cc7f1b4c9991a4'
    expect(isUUID(uuid1)).toBe(false)
    expect(isUUID(uuid2)).toBe(false)
    expect(isUUID(uuid3)).toBe(false)
    expect(isUUID(uuid4)).toBe(false)
  })
})
