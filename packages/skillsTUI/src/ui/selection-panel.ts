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

const getSelectionListContent = (selectedSkills: Map<string, Skill>) => {
  const skills = [...selectedSkills.values()]
  return skills.map((skill) => `• ${skill.name}`).join('\n')
}

const getGeneratedCommandContent = (
  selectedSkills: Map<string, Skill>,
  getAgents: () => Agent[],
) => {
  const skills = [...selectedSkills.values()]
  const agents = getAgents()
  return skills
    .map((skill) => generateInstallCommand(skill, agents))
    .join(' &&\n')
}

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
      getGeneratedCommandContent(selectedSkills, getAgents),
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
        getGeneratedCommandContent(selectedSkills, getAgents),
      )
    }
  }

  const getCommandText = () =>
    getGeneratedCommandContent(selectedSkills, getAgents)

  return {
    panel,
    selectedSkills,
    selectionStatus,
    toggleSkill,
    refreshCommand,
    getCommandText,
  }
}
