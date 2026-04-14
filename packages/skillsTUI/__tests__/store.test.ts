import { describe, expect, test } from 'bun:test'
import { getInitialState, reducer } from '../src/ui/store'
import type { Skill } from '../src/ui/types'
import type { Agent } from '../src/ui/agents'

const skill = (id: string): Skill => ({
  id,
  skillId: id,
  name: id,
  installs: 1,
  source: 'owner/repo',
  command: 'npx skills add x',
  url: `https://skills.sh/${id}`,
})

const agent = (value: string): Agent => ({
  value,
  label: value,
  hint: '.agents/skills/',
})

describe('reducer', () => {
  test('SET_QUERY updates query', () => {
    const state = reducer(getInitialState(), { type: 'SET_QUERY', payload: 'bun' })
    expect(state.query).toBe('bun')
  })

  test('SET_LAST_QUERY updates lastQuery', () => {
    const state = reducer(getInitialState(), { type: 'SET_LAST_QUERY', payload: 'astro' })
    expect(state.lastQuery).toBe('astro')
  })

  test('SET_RESULTS sets results, clears loading and error, resets focusedSkillIndex', () => {
    const base = { ...getInitialState(), isLoading: true, error: 'prev error', focusedSkillIndex: 5 }
    const skills = [skill('a'), skill('b')]
    const state = reducer(base, { type: 'SET_RESULTS', payload: skills })
    expect(state.results).toBe(skills)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.focusedSkillIndex).toBe(0)
  })

  test('SET_LOADING sets isLoading', () => {
    const state = reducer(getInitialState(), { type: 'SET_LOADING', payload: true })
    expect(state.isLoading).toBe(true)
  })

  test('SET_ERROR sets error and clears isLoading', () => {
    const base = { ...getInitialState(), isLoading: true }
    const state = reducer(base, { type: 'SET_ERROR', payload: 'something went wrong' })
    expect(state.error).toBe('something went wrong')
    expect(state.isLoading).toBe(false)
  })

  test('TOGGLE_SKILL adds skill when not selected', () => {
    const s = skill('react')
    const state = reducer(getInitialState(), { type: 'TOGGLE_SKILL', payload: s })
    expect(state.selectedSkills.has('react')).toBe(true)
    expect(state.selectedSkills.get('react')).toBe(s)
  })

  test('TOGGLE_SKILL removes skill when already selected', () => {
    const s = skill('react')
    const after1 = reducer(getInitialState(), { type: 'TOGGLE_SKILL', payload: s })
    const after2 = reducer(after1, { type: 'TOGGLE_SKILL', payload: s })
    expect(after2.selectedSkills.has('react')).toBe(false)
  })

  test('TOGGLE_SKILL does not mutate previous state', () => {
    const s = skill('react')
    const initial = getInitialState()
    reducer(initial, { type: 'TOGGLE_SKILL', payload: s })
    expect(initial.selectedSkills.size).toBe(0)
  })

  test('TOGGLE_AGENT adds agent when not selected', () => {
    const a = agent('cursor')
    const state = reducer(getInitialState(), { type: 'TOGGLE_AGENT', payload: a })
    expect(state.selectedAgents.has('cursor')).toBe(true)
  })

  test('TOGGLE_AGENT removes agent when already selected', () => {
    const a = agent('cursor')
    const after1 = reducer(getInitialState(), { type: 'TOGGLE_AGENT', payload: a })
    const after2 = reducer(after1, { type: 'TOGGLE_AGENT', payload: a })
    expect(after2.selectedAgents.has('cursor')).toBe(false)
  })

  test('SET_FOCUS updates focusedPanel', () => {
    const state = reducer(getInitialState(), { type: 'SET_FOCUS', payload: 'agents' })
    expect(state.focusedPanel).toBe('agents')
  })

  test('SET_SKILL_INDEX updates focusedSkillIndex', () => {
    const state = reducer(getInitialState(), { type: 'SET_SKILL_INDEX', payload: 7 })
    expect(state.focusedSkillIndex).toBe(7)
  })

  test('SET_AGENT_INDEX updates focusedAgentIndex', () => {
    const state = reducer(getInitialState(), { type: 'SET_AGENT_INDEX', payload: 3 })
    expect(state.focusedAgentIndex).toBe(3)
  })

  test('START_INSTALL sets isInstalling to true', () => {
    const state = reducer(getInitialState(), { type: 'START_INSTALL' })
    expect(state.isInstalling).toBe(true)
  })

  test('SET_COPY_STATUS updates copyStatus', () => {
    const success = reducer(getInitialState(), { type: 'SET_COPY_STATUS', payload: 'success' })
    expect(success.copyStatus).toBe('success')

    const error = reducer(getInitialState(), { type: 'SET_COPY_STATUS', payload: 'error' })
    expect(error.copyStatus).toBe('error')

    const idle = reducer(
      { ...getInitialState(), copyStatus: 'success' },
      { type: 'SET_COPY_STATUS', payload: 'idle' },
    )
    expect(idle.copyStatus).toBe('idle')
  })
})
