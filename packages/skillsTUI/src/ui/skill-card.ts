import {
  BoxRenderable,
  TextRenderable,
  bold,
  createTextAttributes,
  fg,
  t,
} from '@opentui/core'
import {
  CHECKBOX_CHECKED,
  CHECKBOX_EMPTY,
  COLOR_BLUE,
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_KEYBOARD_FOCUS,
  COLOR_WHITE,
} from '../constants'
import type { Renderer, Skill } from './types'
import { formatInstallCount, openUrl, truncateLine } from './utils'

export type SkillCardRef = {
  card: BoxRenderable
  setFocused: (focused: boolean) => void
  toggle: () => void
}

function cardHeaderText(
  index: number,
  name: string,
  source: string,
  installs: number,
  selected: boolean,
) {
  const checkbox = selected ? CHECKBOX_CHECKED : CHECKBOX_EMPTY
  return t`${checkbox} ${index + 1}. ${bold(name)} ${fg(COLOR_GRAY)(source)} ${fg(COLOR_GRAY)(`(${formatInstallCount(installs)} installs)`)}`
}

export function SkillCard(
  renderer: Renderer,
  index: number,
  skill: Skill,
  selectedSkills: Map<string, Skill>,
  onToggle: (skill: Skill) => void,
): SkillCardRef {
  const isSelected = () => selectedSkills.has(skill.id)
  const getHeaderForeground = () => (isSelected() ? COLOR_GREEN : COLOR_WHITE)

  const headerText = new TextRenderable(renderer, {
    content: cardHeaderText(
      index,
      skill.name,
      skill.source,
      skill.installs,
      isSelected(),
    ),
    fg: getHeaderForeground(),
    flexGrow: 1,
    flexShrink: 1,
  })

  const headerRow = new BoxRenderable(renderer, {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 1,
  })

  const card = new BoxRenderable(renderer, {
    id: `skill-card-${index}`,
    flexDirection: 'column',
    marginBottom: 1,
  })

  const toggle = () => {
    onToggle(skill)
    headerText.content = cardHeaderText(
      index,
      skill.name,
      skill.source,
      skill.installs,
      isSelected(),
    )
    headerText.fg = getHeaderForeground()
  }

  card.onMouseUp = toggle

  const link = new TextRenderable(renderer, {
    content: 'show detail',
    fg: COLOR_BLUE,
    attributes: createTextAttributes({ underline: true }),
    flexShrink: 0,
  })
  link.onMouseUp = (event) => {
    event.stopPropagation()
    openUrl(skill.url)
  }

  headerRow.add(headerText)
  headerRow.add(link)

  card.add(headerRow)
  const commandWidth = Math.max(20, (process.stdout.columns ?? 80) - 16)
  card.add(
    new TextRenderable(renderer, {
      content: `   ${truncateLine(skill.command, commandWidth)}`,
      fg: COLOR_GRAY,
    }),
  )

  const setFocused = (focused: boolean) => {
    card.backgroundColor = focused ? COLOR_KEYBOARD_FOCUS : undefined
  }

  return { card, setFocused, toggle }
}
