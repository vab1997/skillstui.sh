import { afterEach, describe, expect, mock, test } from 'bun:test'
import { searchSkills } from '../src/api'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('searchSkills', () => {
  test('returns skills sorted by installs descending', async () => {
    globalThis.fetch = mock(async () =>
      new Response(
        JSON.stringify({
          skills: [
            {
              id: 'b',
              skillId: 'b',
              name: 'low-installs',
              installs: 10,
              source: 'owner/low',
              command: 'npx skills add low',
              url: 'https://skills.sh/b',
            },
            {
              id: 'a',
              skillId: 'a',
              name: 'high-installs',
              installs: 999,
              source: 'owner/high',
              command: 'npx skills add high',
              url: 'https://skills.sh/a',
            },
          ],
        }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch

    const { skills } = await searchSkills('test')
    expect(skills[0]!.name).toBe('high-installs')
    expect(skills[1]!.name).toBe('low-installs')
  })

  test('throws on non-ok API response', async () => {
    globalThis.fetch = mock(async () =>
      new Response('Internal Server Error', { status: 500, statusText: 'Internal Server Error' }),
    ) as unknown as typeof fetch

    await expect(searchSkills('test')).rejects.toThrow('Skills API error: 500')
  })
})
