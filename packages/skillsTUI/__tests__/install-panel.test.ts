import { describe, expect, test } from 'bun:test'
import { runCommand } from '../src/ui/InstallPanel'

describe('runCommand', () => {
  test('returns success true when command exits with code 0', async () => {
    const result = await runCommand(['echo', 'hello'])
    expect(result.success).toBe(true)
    expect(result.output).toContain('hello')
  })

  test('returns success false when command exits with non-zero code', async () => {
    const result = await runCommand(['false'])
    expect(result.success).toBe(false)
  })
})
