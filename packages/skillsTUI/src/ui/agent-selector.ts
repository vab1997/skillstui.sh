import {
  BoxRenderable,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import {
  CHECKBOX_CHECKED,
  CHECKBOX_EMPTY,
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_KEYBOARD_FOCUS,
  COLOR_LIGHT_GRAY,
  COLOR_WHITE,
} from '../constants'
import { ADDITIONAL_AGENTS, UNIVERSAL_AGENTS, type Agent } from './agents'
import type { Renderer } from './types'
import { chunkArray } from './utils'

export const AGENTS_PER_ROW = 6
const AGENT_CELL_WIDTH = 20

type AgentSelectorController = {
  panel: BoxRenderable
  selectedAdditionalAgents: Map<string, Agent>
  setAgentFocused: (index: number, focused: boolean) => void
  toggleAgentAtIndex: (index: number) => void
}

function agentCellText(agent: Agent, selected: boolean): string {
  const checkbox = selected ? CHECKBOX_CHECKED : CHECKBOX_EMPTY
  return `${checkbox} ${agent.label}`.padEnd(AGENT_CELL_WIDTH)
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
    height: 15,
  })

  // Universal agents — read-only summary
  const universalLabel = new TextRenderable(renderer, {
    content: `Always included: ${UNIVERSAL_AGENTS.map((a) => a.label).join(' · ')}`,
    fg: COLOR_GRAY,
    marginBottom: 2,
  })
  panel.add(universalLabel)

  // Separator label
  panel.add(
    new TextRenderable(renderer, {
      content: 'Additional (click to add -a flag):',
      fg: COLOR_LIGHT_GRAY,
    }),
  )

  // Additional agents grid
  const agentRefs: { agent: Agent; wrapper: BoxRenderable; toggle: () => void }[] = []
  const rows = chunkArray(ADDITIONAL_AGENTS, AGENTS_PER_ROW)

  for (const row of rows) {
    const rowBox = new BoxRenderable(renderer, {
      flexDirection: 'row',
    })

    for (const agent of row) {
      const cell = new TextRenderable(renderer, {
        id: `agent-cell-${agent.value}`,
        content: agentCellText(agent, false),
        fg: COLOR_WHITE,
      })

      const wrapper = new BoxRenderable(renderer, {
        id: `agent-wrapper-${agent.value}`,
      })

      const toggleAgent = () => {
        if (selectedAdditionalAgents.has(agent.value)) {
          selectedAdditionalAgents.delete(agent.value)
        } else {
          selectedAdditionalAgents.set(agent.value, agent)
        }
        const selected = selectedAdditionalAgents.has(agent.value)
        cell.content = stringToStyledText(agentCellText(agent, selected))
        cell.fg = selected ? COLOR_GREEN : COLOR_WHITE
        onToggle()
      }

      wrapper.onMouseUp = toggleAgent
      wrapper.add(cell)
      agentRefs.push({ agent, wrapper, toggle: toggleAgent })
      rowBox.add(wrapper)
    }

    panel.add(rowBox)
  }

  const setAgentFocused = (index: number, focused: boolean) => {
    const ref = agentRefs[index]
    if (!ref) return
    ref.wrapper.backgroundColor = focused ? COLOR_KEYBOARD_FOCUS : undefined
  }

  const toggleAgentAtIndex = (index: number) => {
    const ref = agentRefs[index]
    if (!ref) return
    ref.toggle()
  }

  return { panel, selectedAdditionalAgents, setAgentFocused, toggleAgentAtIndex }
}
