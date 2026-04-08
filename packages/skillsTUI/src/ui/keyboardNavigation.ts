import type { Key } from 'ink'
import type { Dispatch, MutableRefObject } from 'react'
import { copyToClipboard } from '../clipboard.ts'
import { ADDITIONAL_AGENTS } from './agents.ts'
import type { Action, State } from './store.ts'
import { buildDisplayCommand, openUrl } from './utils.ts'

interface HandleKeyboardNavigationArgs {
  state: State
  dispatch: Dispatch<Action>
  input: string
  key: Key
  copyTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>
}

export function handleKeyboardNavigation({
  state,
  dispatch,
  input,
  key,
  copyTimerRef,
}: HandleKeyboardNavigationArgs) {
  if (key.ctrl && input === 'g') {
    if (state.isInstalling) return
    if (state.selectedSkills.size === 0) return

    dispatch({ type: 'START_INSTALL' })
    return
  }

  if (key.ctrl && input === 'y') {
    if (state.selectedSkills.size === 0) return

    try {
      const command = buildDisplayCommand(
        state.selectedSkills,
        state.selectedAgents,
      )
      copyToClipboard(command)
      dispatch({ type: 'SET_COPY_STATUS', payload: 'success' })
    } catch {
      dispatch({ type: 'SET_COPY_STATUS', payload: 'error' })
    }

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)

    copyTimerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_COPY_STATUS', payload: 'idle' })
    }, 2000)

    return
  }

  const currentPanel = state.focusedPanel

  if (key.tab) {
    if (key.shift) {
      const previousPanel =
        currentPanel === 'search'
          ? 'agents'
          : currentPanel === 'skills'
            ? 'search'
            : 'skills'

      dispatch({ type: 'SET_FOCUS', payload: previousPanel })
    } else {
      const nextPanel =
        currentPanel === 'search'
          ? 'skills'
          : currentPanel === 'skills'
            ? 'agents'
            : 'search'

      dispatch({ type: 'SET_FOCUS', payload: nextPanel })
    }

    return
  }

  if (key.escape) {
    dispatch({ type: 'SET_FOCUS', payload: 'search' })
    return
  }

  if (state.focusedPanel === 'skills') {
    if (key.upArrow) {
      dispatch({
        type: 'SET_SKILL_INDEX',
        payload: Math.max(0, state.focusedSkillIndex - 1),
      })
      return
    }

    if (key.downArrow) {
      dispatch({
        type: 'SET_SKILL_INDEX',
        payload: Math.min(
          state.results.length - 1,
          state.focusedSkillIndex + 1,
        ),
      })
      return
    }

    if (input === ' ') {
      const skill = state.results[state.focusedSkillIndex]
      if (skill) dispatch({ type: 'TOGGLE_SKILL', payload: skill })
      return
    }

    if (input === 's') {
      const skill = state.results[state.focusedSkillIndex]
      if (skill) openUrl(skill.url)
    }

    return
  }

  if (state.focusedPanel !== 'agents') return

  if (key.upArrow) {
    dispatch({
      type: 'SET_AGENT_INDEX',
      payload: Math.max(0, state.focusedAgentIndex - 1),
    })
    return
  }

  if (key.downArrow) {
    dispatch({
      type: 'SET_AGENT_INDEX',
      payload: Math.min(
        ADDITIONAL_AGENTS.length - 1,
        state.focusedAgentIndex + 1,
      ),
    })
    return
  }

  if (input === ' ') {
    const agent = ADDITIONAL_AGENTS[state.focusedAgentIndex]
    if (agent) dispatch({ type: 'TOGGLE_AGENT', payload: agent })
  }
}
