import {
  BoxRenderable,
  ScrollBoxRenderable,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import {
  CHECKBOX_CHECKED,
  CHECKBOX_EMPTY,
  COLOR_FOCUSED_BACKGROUND,
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_KEYBOARD_FOCUS,
  COLOR_LIGHT_GRAY,
  COLOR_WHITE,
} from '../constants'
import { ADDITIONAL_AGENTS, UNIVERSAL_AGENTS, type Agent } from './agents'
import type { Renderer } from './types'

type AgentSelectorController = {
  panel: BoxRenderable
  selectedAdditionalAgents: Map<string, Agent>
  setAgentFocused: (index: number, focused: boolean) => void
  toggleAgentAtIndex: (index: number) => void
  scrollAgentIntoView: (index: number) => void
}

const agentRowText = (agent: Agent, selected: boolean): string => {
  const checkbox = selected ? CHECKBOX_CHECKED : CHECKBOX_EMPTY
  return `${checkbox} ${agent.label}`
}

export function createAgentSelectorController(
  renderer: Renderer,
  onToggle: () => void,
): AgentSelectorController {
  const selectedAdditionalAgents = new Map<string, Agent>()

  const panel = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    borderColor: COLOR_WHITE,
    padding: 1,
    flexDirection: 'column',
    gap: 1,
    title: 'Install Agents',
    height: 13,
  })

  // Universal agents — read-only summary
  const universalLabel = new TextRenderable(renderer, {
    content: `Always included: ${UNIVERSAL_AGENTS.map((a) => a.label).join(' · ')}`,
    fg: COLOR_GRAY,
  })
  panel.add(universalLabel)

  // Separator label
  panel.add(
    new TextRenderable(renderer, {
      content: 'Additional (click to add -a flag):',
      fg: COLOR_LIGHT_GRAY,
    }),
  )

  const agentsScroll = new ScrollBoxRenderable(renderer, {
    scrollY: true,
    scrollX: false,
    scrollbarOptions: {
      trackOptions: { backgroundColor: COLOR_FOCUSED_BACKGROUND },
    },
  })
  agentsScroll.height = 4
  panel.add(agentsScroll)

  // Additional agents list
  const agentRefs: { agent: Agent; row: BoxRenderable; toggle: () => void }[] = []

  for (let i = 0; i < ADDITIONAL_AGENTS.length; i++) {
    const agent = ADDITIONAL_AGENTS[i]!

    const rowText = new TextRenderable(renderer, {
      content: agentRowText(agent, false),
      fg: COLOR_WHITE,
    })

    const row = new BoxRenderable(renderer, {
      id: `agent-row-${i}`,
    })

    const toggleAgent = () => {
      if (selectedAdditionalAgents.has(agent.value)) {
        selectedAdditionalAgents.delete(agent.value)
      } else {
        selectedAdditionalAgents.set(agent.value, agent)
      }
      const selected = selectedAdditionalAgents.has(agent.value)
      rowText.content = stringToStyledText(agentRowText(agent, selected))
      rowText.fg = selected ? COLOR_GREEN : COLOR_WHITE
      onToggle()
    }

    row.onMouseUp = toggleAgent
    row.add(rowText)
    agentRefs.push({ agent, row, toggle: toggleAgent })
    agentsScroll.add(row)
  }

  const setAgentFocused = (index: number, focused: boolean) => {
    const ref = agentRefs[index]
    if (!ref) return
    ref.row.backgroundColor = focused ? COLOR_KEYBOARD_FOCUS : undefined
  }

  const toggleAgentAtIndex = (index: number) => {
    const ref = agentRefs[index]
    if (!ref) return
    ref.toggle()
  }

  const scrollAgentIntoView = (index: number) => {
    agentsScroll.scrollChildIntoView(`agent-row-${index}`)
  }

  return { panel, selectedAdditionalAgents, setAgentFocused, toggleAgentAtIndex, scrollAgentIntoView }
}
