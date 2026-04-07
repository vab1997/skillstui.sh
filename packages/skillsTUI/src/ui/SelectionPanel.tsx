import { Box, Text } from 'ink'
import { memo } from 'react'
import {
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_RED,
  COLOR_WHITE,
} from '../constants.ts'
import type { Agent } from './agents.ts'
import type { Skill } from './types.ts'
import { buildDisplayCommand } from './utils.ts'

interface Props {
  selectedSkills: Map<string, Skill>
  selectedAgents: Map<string, Agent>
  copyStatus: 'idle' | 'success' | 'error'
}

const MAX_DISPLAY_LINES = 5

export const SelectionPanel = memo(function SelectionPanel({
  selectedSkills,
  selectedAgents,
  copyStatus,
}: Props) {
  const count = selectedSkills.size

  const copyStatusColor =
    copyStatus === 'success'
      ? COLOR_GREEN
      : copyStatus === 'error'
        ? COLOR_RED
        : COLOR_GRAY

  const copyStatusText =
    copyStatus === 'success'
      ? 'Copied to clipboard!'
      : copyStatus === 'error'
        ? 'Failed to copy'
        : count > 0
          ? 'Ctrl+Y to copy'
          : ''

  let namesLine = ''
  let visibleCommandLines: string[] = []
  if (count > 0) {
    namesLine = [...selectedSkills.values()].map((s) => s.name).join(' · ')
    const commandLines = buildDisplayCommand(
      selectedSkills,
      selectedAgents,
    ).split('\n')
    const truncated = commandLines.length > MAX_DISPLAY_LINES
    visibleCommandLines = truncated
      ? commandLines.slice(0, MAX_DISPLAY_LINES)
      : commandLines
    if (truncated) {
      const last = visibleCommandLines[visibleCommandLines.length - 1]!
      visibleCommandLines[visibleCommandLines.length - 1] =
        (last.length > 3 ? last.slice(0, -3) : '') + '...'
    }
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={COLOR_GRAY}
      paddingX={1}
    >
      <Text bold color={COLOR_WHITE}>
        Selected Skills{count > 0 ? ` (${count})` : ''}{' '}
        {count > 0 && <Text color={copyStatusColor}> — {copyStatusText}</Text>}
      </Text>

      {count === 0 ? (
        <Text color={COLOR_GRAY}>
          No skills selected. Navigate results and press Space to select.
        </Text>
      ) : (
        <>
          <Text color={COLOR_WHITE}>{namesLine}</Text>
          <Box flexDirection="column" marginTop={1}>
            {visibleCommandLines.map((line, i) => (
              <Text key={i} color={COLOR_GRAY}>
                {line}
              </Text>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
})
