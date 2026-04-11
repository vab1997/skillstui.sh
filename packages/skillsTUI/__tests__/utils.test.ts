import { describe, expect, test } from 'bun:test'
import type { Agent } from '../src/ui/agents'
import type { Skill } from '../src/ui/types'
import {
  clampTextToLines,
  chunkArray,
  formatInstallCount,
  generateInstallCommand,
  truncateLine,
} from '../src/ui/utils'

const mockSkill: Skill = {
  id: 'test-skill',
  skillId: 'test-skill',
  name: 'test-skill',
  url: 'https://skills.sh/test-skill',
  command: 'npx skills add https://github.com/owner/repo --skill test-skill',
  installs: 100,
  source: 'owner/repo',
}

describe('generateInstallCommand', () => {
  test('builds correct command with agents', () => {
    const agents: Agent[] = [
      { value: 'claude-code', label: 'Claude Code', hint: '.claude/skills/' },
      { value: 'amp', label: 'Amp', hint: '.agents/skills/' },
    ]
    const result = generateInstallCommand(mockSkill, agents)
    expect(result).toBe(
      'npx -y skills add https://github.com/owner/repo --skill test-skill -a claude-code -a amp -y',
    )
  })

  test('builds correct command with no agents', () => {
    const result = generateInstallCommand(mockSkill, [])
    expect(result).toBe(
      'npx -y skills add https://github.com/owner/repo --skill test-skill -y',
    )
  })
})

describe('formatInstallCount', () => {
  test('formats thousands with k suffix', () => {
    expect(formatInstallCount(1500)).toBe('1.5k')
    expect(formatInstallCount(2000)).toBe('2k')
    expect(formatInstallCount(10000)).toBe('10k')
    expect(formatInstallCount(100000)).toBe('100k')
  })

  test('formats zero as plain number', () => {
    expect(formatInstallCount(0)).toBe('0')
  })

  test('formats millions with M suffix', () => {
    expect(formatInstallCount(2_000_000)).toBe('2M')
    expect(formatInstallCount(1_500_000)).toBe('1.5M')
    expect(formatInstallCount(2_550_000)).toBe('2.5M')
  })
})

describe('truncateLine', () => {
  test('returns text unchanged when within limit', () => {
    expect(truncateLine('hello', 10)).toBe('hello')
    expect(truncateLine('hello world', 9)).toBe('hello wo…')
  })

  test('truncates with ellipsis when over limit', () => {
    const result = truncateLine('hello world', 8)
    expect(result).toBe('hello w…')
    expect(result.length).toBe(8)
  })
})

describe('chunkArray', () => {
  test('splits array into correct chunks', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  test('returns empty array for empty input', () => {
    expect(chunkArray([], 2)).toEqual([])
  })
})

describe('clampTextToLines', () => {
  test('returns wrapped text when it fits within the line limit', () => {
    expect(clampTextToLines('uno dos tres', 7, 2)).toBe(
      'uno dos\ntres',
    )
  })

  test('truncates the last visible line when text exceeds the line limit', () => {
    expect(clampTextToLines('uno dos tres cuatro cinco', 7, 2)).toBe(
      'uno dos\ntres...',
    )
  })

  test('splits long words before truncating', () => {
    expect(clampTextToLines('supercalifragilistico', 5, 2)).toBe(
      'super\nca...',
    )
  })
})
