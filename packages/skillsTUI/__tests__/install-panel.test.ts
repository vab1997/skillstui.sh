import { describe, expect, mock, test } from 'bun:test'

mock.module('@opentui/core', () => ({
  BoxRenderable: class {},
  TextRenderable: class {},
  KeyEvent: class {},
  stringToStyledText: (s: string) => s,
}))

const { runCommand } = await import('../src/ui/install-panel')

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
