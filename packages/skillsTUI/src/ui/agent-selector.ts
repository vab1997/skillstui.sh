import {
  BoxRenderable,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import {
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_LIGHT_GRAY,
  COLOR_WHITE,
} from '../constants'
import { ADDITIONAL_AGENTS, UNIVERSAL_AGENTS, type Agent } from './agents'
import type { Renderer } from './types'

const AGENTS_PER_ROW = 6
const AGENT_CELL_WIDTH = 20

type AgentSelectorController = {
  panel: BoxRenderable
  selectedAdditionalAgents: Map<string, Agent>
}

function agentCellText(agent: Agent, selected: boolean): string {
  const checkbox = selected ? '[x]' : '[ ]'
  return `${checkbox} ${agent.label}`.padEnd(AGENT_CELL_WIDTH)
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export function createAgentSelectorController(
  renderer: Renderer,
  onToggle: () => void,
): AgentSelectorController {
  const selectedAdditionalAgents = new Map<string, Agent>()

  const panel = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    borderColor: '#fff',
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

      cell.onMouseUp = () => {
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

      rowBox.add(cell)
    }

    panel.add(rowBox)
  }

  return { panel, selectedAdditionalAgents }
}
