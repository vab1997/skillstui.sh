import { beforeEach, describe, expect, mock, test } from 'bun:test'
import type { Key } from 'ink'
import type { Dispatch, MutableRefObject } from 'react'
import { ADDITIONAL_AGENTS } from '../src/ui/agents'
import { getInitialState } from '../src/ui/store'
import type { Action, State } from '../src/ui/store'
import type { Skill } from '../src/ui/types'

// Mock side-effects before importing the module under test
const mockCopyToClipboard = mock(() => {})
const mockOpenUrl = mock(() => {})
const mockBuildDisplayCommand = mock(() => 'npx skills add foo')

mock.module('../src/clipboard', () => ({
  copyToClipboard: mockCopyToClipboard,
}))

mock.module('../src/ui/utils', () => ({
  buildDisplayCommand: mockBuildDisplayCommand,
  openUrl: mockOpenUrl,
  formatInstallCount: (n: number) => String(n),
  clampTextToLines: (t: string) => t,
  truncateLine: (t: string) => t,
  generateInstallCommand: () => '',
}))

const { handleKeyboardNavigation } = await import('../src/ui/keyboardNavigation')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const skill = (id: string): Skill => ({
  id,
  skillId: id,
  name: id,
  installs: 1,
  source: 'owner/repo',
  command: 'npx skills add x',
  url: `https://skills.sh/${id}`,
})

const baseKey: Key = {
  ctrl: false,
  shift: false,
  tab: false,
  escape: false,
  upArrow: false,
  downArrow: false,
  leftArrow: false,
  rightArrow: false,
  return: false,
  backspace: false,
  delete: false,
  pageDown: false,
  pageUp: false,
  meta: false,
}

function makeArgs(
  stateOverride: Partial<State>,
  inputOverride = '',
  keyOverride: Partial<Key> = {},
) {
  const dispatch = mock((_action: Action) => {})
  const copyTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null> = { current: null }
  return {
    state: { ...getInitialState(), ...stateOverride },
    dispatch: dispatch as unknown as Dispatch<Action>,
    input: inputOverride,
    key: { ...baseKey, ...keyOverride },
    copyTimerRef,
    calls: dispatch.mock.calls,
  }
}

// ---------------------------------------------------------------------------

describe('handleKeyboardNavigation — Ctrl+G (install)', () => {
  test('dispatches START_INSTALL when skill is selected', () => {
    const s = skill('react')
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { selectedSkills: new Map([['react', s]]) },
      'g',
      { ctrl: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'START_INSTALL' })
  })

  test('does not dispatch when no skills are selected', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      {},
      'g',
      { ctrl: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls.length).toBe(0)
  })

  test('does not dispatch when already installing', () => {
    const s = skill('react')
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { selectedSkills: new Map([['react', s]]), isInstalling: true },
      'g',
      { ctrl: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls.length).toBe(0)
  })
})

describe('handleKeyboardNavigation — Ctrl+Y (copy)', () => {
  beforeEach(() => {
    mockCopyToClipboard.mockReset()
    mockBuildDisplayCommand.mockReset()
    mockBuildDisplayCommand.mockImplementation(() => 'npx skills add foo')
  })

  test('dispatches SET_COPY_STATUS success when skill is selected', () => {
    const s = skill('react')
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { selectedSkills: new Map([['react', s]]) },
      'y',
      { ctrl: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_COPY_STATUS', payload: 'success' })
  })

  test('does not dispatch when no skills selected', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      {},
      'y',
      { ctrl: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls.length).toBe(0)
  })

  test('dispatches SET_COPY_STATUS error when copyToClipboard throws', () => {
    mockCopyToClipboard.mockImplementation(() => { throw new Error('clipboard error') })
    const s = skill('react')
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { selectedSkills: new Map([['react', s]]) },
      'y',
      { ctrl: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_COPY_STATUS', payload: 'error' })
  })
})

describe('handleKeyboardNavigation — Tab / Shift+Tab (panel cycle)', () => {
  const tabCases: Array<[State['focusedPanel'], boolean, State['focusedPanel']]> = [
    ['search', false, 'skills'],
    ['skills', false, 'agents'],
    ['agents', false, 'search'],
    ['search', true, 'agents'],
    ['skills', true, 'search'],
    ['agents', true, 'skills'],
  ]

  for (const [from, shift, to] of tabCases) {
    test(`${from} + ${shift ? 'Shift+' : ''}Tab → ${to}`, () => {
      const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
        { focusedPanel: from },
        '',
        { tab: true, shift },
      )
      handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
      expect(calls[0]?.[0]).toEqual({ type: 'SET_FOCUS', payload: to })
    })
  }
})

describe('handleKeyboardNavigation — Escape', () => {
  test('sets focus to search from any panel', () => {
    for (const panel of ['skills', 'agents'] as const) {
      const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
        { focusedPanel: panel },
        '',
        { escape: true },
      )
      handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
      expect(calls[0]?.[0]).toEqual({ type: 'SET_FOCUS', payload: 'search' })
    }
  })
})

describe('handleKeyboardNavigation — arrows in skills panel', () => {
  test('up decrements focusedSkillIndex', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'skills', focusedSkillIndex: 2, results: [skill('a'), skill('b'), skill('c')] },
      '',
      { upArrow: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_SKILL_INDEX', payload: 1 })
  })

  test('up does not go below 0', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'skills', focusedSkillIndex: 0, results: [skill('a')] },
      '',
      { upArrow: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_SKILL_INDEX', payload: 0 })
  })

  test('down increments focusedSkillIndex', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'skills', focusedSkillIndex: 1, results: [skill('a'), skill('b'), skill('c')] },
      '',
      { downArrow: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_SKILL_INDEX', payload: 2 })
  })

  test('down does not exceed last result index', () => {
    const results = [skill('a'), skill('b')]
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'skills', focusedSkillIndex: 1, results },
      '',
      { downArrow: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_SKILL_INDEX', payload: 1 })
  })
})

describe('handleKeyboardNavigation — space in skills panel', () => {
  test('dispatches TOGGLE_SKILL for focused skill', () => {
    const s = skill('react')
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'skills', focusedSkillIndex: 0, results: [s] },
      ' ',
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'TOGGLE_SKILL', payload: s })
  })
})

describe('handleKeyboardNavigation — arrows in agents panel', () => {
  test('up does not go below 0', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'agents', focusedAgentIndex: 0 },
      '',
      { upArrow: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_AGENT_INDEX', payload: 0 })
  })

  test('down does not exceed ADDITIONAL_AGENTS length - 1', () => {
    const last = ADDITIONAL_AGENTS.length - 1
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'agents', focusedAgentIndex: last },
      '',
      { downArrow: true },
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'SET_AGENT_INDEX', payload: last })
  })
})

describe('handleKeyboardNavigation — space in agents panel', () => {
  test('dispatches TOGGLE_AGENT for focused agent', () => {
    const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
      { focusedPanel: 'agents', focusedAgentIndex: 0 },
      ' ',
    )
    handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
    expect(calls[0]?.[0]).toEqual({ type: 'TOGGLE_AGENT', payload: ADDITIONAL_AGENTS[0]! })
  })
})

describe('handleKeyboardNavigation — search panel ignores navigation keys', () => {
  test('up/down in search panel do not dispatch navigation actions', () => {
    for (const keyOverride of [{ upArrow: true }, { downArrow: true }]) {
      const { state, dispatch, input, key, copyTimerRef, calls } = makeArgs(
        { focusedPanel: 'search' },
        '',
        keyOverride,
      )
      handleKeyboardNavigation({ state, dispatch, input, key, copyTimerRef })
      expect(calls.length).toBe(0)
    }
  })
})
