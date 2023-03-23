import { describe, expect, it } from 'vitest'
import {
  getFileInfo,
  bytesToSize,
  getFileExtensionFromURL,
  getImageData,
  // Skipping uploadFile and deleteFile because they need a server-side implementation
  getSelectedFile
} from '../files'

describe('File Utils', () => {
  describe('getFileInfo', () => {
    it('should return the correct file name and extension', () => {
      const fileInfo = getFileInfo('example_image.png')
      expect(fileInfo).toEqual({
        fileName: 'example_image',
        extension: 'png'
      })
    })

    it('should return empty strings if no file is provided', () => {
      const fileInfo = getFileInfo(null)
      expect(fileInfo).toEqual({
        fileName: '',
        extension: ''
      })
    })
  })

  describe('bytesToSize', () => {
    it('should return the correct size and allowed status', () => {
      const sizeInfo = bytesToSize(100000, 52000000)
      expect(sizeInfo).toEqual({
        size: '97.7 KB',
        allowed: true
      })
    })

    it('should return allowed false if size exceeds maxFileSize', () => {
      const sizeInfo = bytesToSize(53000000, 52000000)
      expect(sizeInfo).toEqual({
        size: '50.5 MB',
        allowed: false
      })
    })

    it('should return rounded size when round is true', () => {
      const sizeInfo = bytesToSize(100000, 52000000, true)
      expect(sizeInfo).toEqual({
        size: '98 KB',
        allowed: true
      })
    })
  })

  describe('getFileExtensionFromURL', () => {
    it('should return the correct file name and extension from URL', () => {
      const fileInfo = getFileExtensionFromURL('https://example.com/files/example_image.png')
      expect(fileInfo).toEqual({
        fileName: 'example_image',
        extension: 'png'
      })
    })

    it('should return empty strings if no URL is provided', () => {
      const fileInfo = getFileExtensionFromURL('')
      expect(fileInfo).toEqual({
        fileName: '',
        extension: ''
      })
    })
  })

  // Skipping getImageData because it requires a DOM
  // Skipping uploadFile and deleteFile because they need a server-side implementation
  // Skipping getSelectedFile because it requires a DOM and a File object
})
