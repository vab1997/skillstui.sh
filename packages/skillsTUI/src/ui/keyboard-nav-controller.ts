import type { KeyEvent } from '@opentui/core'
import type { ScrollBoxRenderable } from '@opentui/core'
import { ADDITIONAL_AGENTS } from './agents'
import type { SkillCardRef } from './skill-card'
import type { LabeledInput } from './labeled-input'
import type { createAgentSelectorController } from './agent-selector'

type PanelFocus = 'search' | 'skills' | 'agents'

type KeyboardNavControllerOptions = {
  skillSearch: ReturnType<typeof LabeledInput>
  resultsScroll: ScrollBoxRenderable
  agentSelectorController: ReturnType<typeof createAgentSelectorController>
}

export function createKeyboardNavController({
  skillSearch,
  resultsScroll,
  agentSelectorController,
}: KeyboardNavControllerOptions) {
  let panelFocus: PanelFocus = 'search'
  let skillCards: SkillCardRef[] = []
  let focusedSkillIndex = 0
  let focusedAgentIndex = 0

  const clearSkillFocus = () => skillCards[focusedSkillIndex]?.setFocused(false)
  const clearAgentFocus = () => agentSelectorController.setAgentFocused(focusedAgentIndex, false)

  function switchFocus(to: PanelFocus) {
    if (panelFocus === 'skills') clearSkillFocus()
    if (panelFocus === 'agents') clearAgentFocus()
    panelFocus = to

    if (to === 'search') {
      skillSearch.input.focus()
    } else {
      skillSearch.input.blur()
      if (to === 'skills' && skillCards.length > 0) {
        skillCards[focusedSkillIndex]?.setFocused(true)
        resultsScroll.scrollChildIntoView(`skill-card-${focusedSkillIndex}`)
      } else if (to === 'agents') {
        agentSelectorController.setAgentFocused(focusedAgentIndex, true)
      }
    }
  }

  function onSkillsLoaded(cards: SkillCardRef[]) {
    clearSkillFocus()
    skillCards = cards
    focusedSkillIndex = 0
    if (cards.length > 0) {
      switchFocus('skills')
    }
  }

  function handleKey(key: KeyEvent) {
    // Tab: cycle panels forward
    if (key.name === 'tab' && !key.ctrl && !key.shift) {
      key.preventDefault()
      key.stopPropagation()
      if (panelFocus === 'search') {
        switchFocus(skillCards.length > 0 ? 'skills' : 'agents')
      } else if (panelFocus === 'skills') {
        switchFocus('agents')
      } else {
        switchFocus('search')
      }
      return
    }

    // Shift+Tab: cycle panels backward
    if (key.name === 'tab' && key.shift) {
      key.preventDefault()
      key.stopPropagation()
      if (panelFocus === 'agents') {
        switchFocus(skillCards.length > 0 ? 'skills' : 'search')
      } else if (panelFocus === 'skills') {
        switchFocus('search')
      } else {
        switchFocus('agents')
      }
      return
    }

    // Escape: always back to search
    if (key.name === 'escape') {
      key.preventDefault()
      key.stopPropagation()
      switchFocus('search')
      return
    }

    // Skills navigation
    if (panelFocus === 'skills') {
      if (key.name === 'down') {
        key.preventDefault()
        const next = Math.min(focusedSkillIndex + 1, skillCards.length - 1)
        clearSkillFocus()
        focusedSkillIndex = next
        skillCards[focusedSkillIndex]?.setFocused(true)
        resultsScroll.scrollChildIntoView(`skill-card-${focusedSkillIndex}`)
      } else if (key.name === 'up') {
        key.preventDefault()
        const prev = Math.max(focusedSkillIndex - 1, 0)
        clearSkillFocus()
        focusedSkillIndex = prev
        skillCards[focusedSkillIndex]?.setFocused(true)
        resultsScroll.scrollChildIntoView(`skill-card-${focusedSkillIndex}`)
      } else if (key.name === 'space') {
        key.preventDefault()
        skillCards[focusedSkillIndex]?.toggle()
      }
      return
    }

    // Agents navigation (2D grid)
    if (panelFocus === 'agents') {
      const total = ADDITIONAL_AGENTS.length
      let next = focusedAgentIndex

      if (key.name === 'space') {
        key.preventDefault()
        agentSelectorController.toggleAgentAtIndex(focusedAgentIndex)
        return
      }

      if (key.name === 'down') next = Math.min(next + 1, total - 1)
      else if (key.name === 'up') next = Math.max(next - 1, 0)
      else return

      if (next !== focusedAgentIndex) {
        key.preventDefault()
        clearAgentFocus()
        focusedAgentIndex = next
        agentSelectorController.setAgentFocused(focusedAgentIndex, true)
        agentSelectorController.scrollAgentIntoView(focusedAgentIndex)
      }
    }
  }

  return { handleKey, onSkillsLoaded }
}
