import { Box, Text } from 'ink'
import {
  CHECKBOX_CHECKED,
  CHECKBOX_EMPTY,
  COLOR_BLUE,
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_WHITE,
} from '../constants.ts'
import type { Skill } from './types.ts'
import { formatInstallCount } from './utils.ts'

interface Props {
  skill: Skill
  index: number
  isSelected: boolean
  isFocused: boolean
}

export function SkillCard({ skill, index, isSelected, isFocused }: Props) {
  const checkbox = isSelected ? CHECKBOX_CHECKED : CHECKBOX_EMPTY
  const nameColor = isSelected ? COLOR_GREEN : COLOR_WHITE
  const focusIndicator = isFocused ? '▶ ' : '  '

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Text color={COLOR_GREEN}>{focusIndicator}</Text>
          <Text color={nameColor} bold>
            {checkbox} {index + 1}. {skill.name}{' '}
            <Text color={COLOR_GRAY}>{skill.source}</Text>{' '}
          </Text>
          <Text color={COLOR_GRAY}>
            ({formatInstallCount(skill.installs)} installs)
          </Text>
        </Box>
        <Text color={COLOR_BLUE} dimColor={!isFocused}>
          {' '}
          [show detail]
        </Text>
      </Box>
      <Text color={COLOR_GRAY}> {skill.command}</Text>
    </Box>
  )
}
