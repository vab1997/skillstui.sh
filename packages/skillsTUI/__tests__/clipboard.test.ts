import { afterEach, describe, expect, test } from 'bun:test'
import { getClipboardCommand } from '../src/clipboard'

describe('getClipboardCommand', () => {
  const originalPlatform = process.platform

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform })
  })

  test('returns pbcopy on macOS', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' })
    const [cmd, args] = getClipboardCommand()
    expect(cmd).toBe('pbcopy')
    expect(args).toEqual([])
  })

  test('returns xclip on Linux', () => {
    Object.defineProperty(process, 'platform', { value: 'linux' })
    const [cmd, args] = getClipboardCommand()
    expect(cmd).toBe('xclip')
    expect(args).toEqual(['-selection', 'clipboard'])
  })

  test('returns clip on Windows', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const [cmd, args] = getClipboardCommand()
    expect(cmd).toBe('clip')
    expect(args).toEqual([])
  })
})
