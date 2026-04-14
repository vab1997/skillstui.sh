import { describe, expect, test } from 'bun:test'
import {
  FIXED_CONTENT_LINES,
  MAX_SKILL_LIST_HEIGHT,
  MIN_SKILL_LIST_HEIGHT,
  calculateSkillListHeight,
} from '../src/ui/utils/calculateSkillListHeight'

// ---------------------------------------------------------------------------
// calculateSkillListHeight
// ---------------------------------------------------------------------------

describe('calculateSkillListHeight', () => {
  test('is capped at MAX on a very large terminal (100 rows)', () => {
    expect(calculateSkillListHeight(100)).toBe(MAX_SKILL_LIST_HEIGHT)
  })

  test('is capped at MAX on a large terminal (80 rows)', () => {
    expect(calculateSkillListHeight(80)).toBe(MAX_SKILL_LIST_HEIGHT)
  })

  test('returns calculated value when terminal fits but is not huge (60 rows)', () => {
    const expected = Math.min(MAX_SKILL_LIST_HEIGHT, Math.max(MIN_SKILL_LIST_HEIGHT, 60 - FIXED_CONTENT_LINES))
    expect(calculateSkillListHeight(60)).toBe(expected)
  })

  test('returns MIN_SKILL_LIST_HEIGHT on a very small terminal (20 rows)', () => {
    expect(calculateSkillListHeight(20)).toBe(MIN_SKILL_LIST_HEIGHT)
  })

  test('never returns less than MIN_SKILL_LIST_HEIGHT', () => {
    for (const rows of [1, 5, 10, 15, 20, 25]) {
      expect(calculateSkillListHeight(rows)).toBeGreaterThanOrEqual(MIN_SKILL_LIST_HEIGHT)
    }
  })

  test('never returns more than MAX_SKILL_LIST_HEIGHT', () => {
    for (const rows of [60, 80, 100, 150, 200]) {
      expect(calculateSkillListHeight(rows)).toBeLessThanOrEqual(MAX_SKILL_LIST_HEIGHT)
    }
  })

  test('exact fit at FIXED + MIN gives MIN', () => {
    expect(calculateSkillListHeight(FIXED_CONTENT_LINES + MIN_SKILL_LIST_HEIGHT)).toBe(MIN_SKILL_LIST_HEIGHT)
  })

  test('exact fit at FIXED + MAX gives MAX', () => {
    expect(calculateSkillListHeight(FIXED_CONTENT_LINES + MAX_SKILL_LIST_HEIGHT)).toBe(MAX_SKILL_LIST_HEIGHT)
  })
})
