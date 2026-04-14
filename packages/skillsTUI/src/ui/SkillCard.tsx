import { Box, Text } from 'ink'
import { memo } from 'react'
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

export const SkillCard = memo(function SkillCard({
  skill,
  index,
  isSelected,
  isFocused,
}: Props) {
  const checkbox = isSelected ? CHECKBOX_CHECKED : CHECKBOX_EMPTY
  const nameColor = isSelected ? COLOR_GREEN : COLOR_WHITE
  const focusIndicator = isFocused ? '▶ ' : '  '

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Text color={COLOR_GREEN}>{focusIndicator}</Text>
          <Text color={nameColor} bold wrap="truncate-end">
            {checkbox} {index + 1}. {skill.name}{' '}
          </Text>
          <Text color={COLOR_GRAY} wrap="truncate-end">
            {`(${formatInstallCount(skill.installs)} install${
              skill.installs !== 1 ? 's' : ''
            })`}{' '}
          </Text>
        </Box>

        <Text color={COLOR_BLUE} dimColor={!isFocused}>
          {' '}
          [Show]
        </Text>
      </Box>
      <Box flexDirection="row" marginLeft={2}>
        <Text color={COLOR_GRAY}>{skill.source}</Text>
      </Box>
    </Box>
  )
})
