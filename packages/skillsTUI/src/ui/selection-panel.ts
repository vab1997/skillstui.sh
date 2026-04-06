import {
  BoxRenderable,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import { COLOR_GRAY, COLOR_WHITE } from '../constants'
import type { Agent } from './agents'
import type { Renderer, Skill } from './types'
import { generateInstallCommand } from './utils'

const EMPTY_SELECTION_MESSAGE =
  'No skills selected. Click a result to select it.'

export type SelectionPanelController = {
  panel: BoxRenderable
  selectedSkills: Map<string, Skill>
  selectionStatus: TextRenderable
  toggleSkill: (skill: Skill) => void
  refreshCommand: () => void
  getCommandText: () => string
}

const getLineWidth = () => Math.max(40, (process.stdout.columns ?? 80) - 6)

const truncateToLines = (text: string, maxLines: number, lineWidth: number): string => {
  const visualLines: string[] = []
  for (const line of text.split('\n')) {
    if (line.length === 0) {
      visualLines.push('')
    } else {
      for (let i = 0; i < line.length; i += lineWidth) {
        visualLines.push(line.slice(i, i + lineWidth))
        if (visualLines.length > maxLines) break
      }
    }
    if (visualLines.length > maxLines) break
  }
  if (visualLines.length <= maxLines) return visualLines.join('\n')
  const result = visualLines.slice(0, maxLines)
  const last = result[result.length - 1]
  if (last !== undefined) {
    result[result.length - 1] = last.slice(0, lineWidth - 1) + '…'
  }
  return result.join('\n')
}

const getSelectionListContent = (selectedSkills: Map<string, Skill>) => {
  const names = [...selectedSkills.values()].map((s) => s.name).join(' · ')
  return truncateToLines(names, 2, getLineWidth())
}

const buildFullCommand = (
  selectedSkills: Map<string, Skill>,
  getAgents: () => Agent[],
) => {
  const skills = [...selectedSkills.values()]
  const agents = getAgents()
  return skills
    .map((skill) => generateInstallCommand(skill, agents))
    .join(' &&\n')
}

const getDisplayCommandContent = (
  selectedSkills: Map<string, Skill>,
  getAgents: () => Agent[],
) => truncateToLines(buildFullCommand(selectedSkills, getAgents), 2, getLineWidth())

export const createSelectionPanelController = (
  renderer: Renderer,
  getAgents: () => Agent[] = () => [],
): SelectionPanelController => {
  const selectedSkills = new Map<string, Skill>()

  const selectionList = new TextRenderable(renderer, {
    content: EMPTY_SELECTION_MESSAGE,
    fg: COLOR_GRAY,
  })

  const generatedCommand = new TextRenderable(renderer, {
    content: '',
    fg: COLOR_WHITE,
  })

  const selectionStatus = new TextRenderable(renderer, {
    content: '',
    fg: COLOR_GRAY,
  })

  const panel = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    borderColor: COLOR_WHITE,
    padding: 1,
    flexDirection: 'column',
    gap: 1,
    title: 'Selected Skills',
    maxHeight: 11,
  })

  panel.add(selectionList)

  let commandVisible = false

  const updateSelectionPanel = () => {
    if (selectedSkills.size === 0) {
      panel.title = 'Selected Skills'
      selectionList.content = stringToStyledText(EMPTY_SELECTION_MESSAGE)
      selectionStatus.content = stringToStyledText('')
      selectionStatus.fg = COLOR_GRAY

      if (!commandVisible) {
        return
      }

      panel.remove(generatedCommand.id)
      panel.remove(selectionStatus.id)
      commandVisible = false
      return
    }

    panel.title = `Selected Skills (${selectedSkills.size}) — Ctrl+Y to copy`
    selectionList.content = stringToStyledText(
      getSelectionListContent(selectedSkills),
    )
    generatedCommand.content = stringToStyledText(
      getDisplayCommandContent(selectedSkills, getAgents),
    )
    selectionStatus.content = stringToStyledText('')
    selectionStatus.fg = COLOR_GRAY

    if (commandVisible) {
      return
    }

    panel.add(generatedCommand)
    panel.add(selectionStatus)
    commandVisible = true
  }

  const toggleSkill = (skill: Skill) => {
    if (selectedSkills.has(skill.id)) {
      selectedSkills.delete(skill.id)
    } else {
      selectedSkills.set(skill.id, skill)
    }

    updateSelectionPanel()
  }

  const refreshCommand = () => {
    if (selectedSkills.size > 0) {
      generatedCommand.content = stringToStyledText(
        getDisplayCommandContent(selectedSkills, getAgents),
      )
    }
  }

  const getCommandText = () => buildFullCommand(selectedSkills, getAgents)

  return {
    panel,
    selectedSkills,
    selectionStatus,
    toggleSkill,
    refreshCommand,
    getCommandText,
  }
}
