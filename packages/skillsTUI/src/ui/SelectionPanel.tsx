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
import { buildDisplayCommand, clampTextToLines } from './utils.ts'

interface Props {
  selectedSkills: Map<string, Skill>
  selectedAgents: Map<string, Agent>
  copyStatus: 'idle' | 'success' | 'error'
}

const MAX_DISPLAY_LINES = 1
const MAX_NAME_LINES = 3
const APP_HORIZONTAL_PADDING = 4
const PANEL_HORIZONTAL_PADDING = 2
const RESERVED_HORIZONTAL_SPACE =
  APP_HORIZONTAL_PADDING + PANEL_HORIZONTAL_PADDING

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
  let visibleNamesLine = ''
  let visibleCommandLines: string[] = []
  if (count > 0) {
    namesLine = [...selectedSkills.values()].map((s) => s.name).join(' · ')
    const availableWidth = Math.max(
      1,
      (process.stdout.columns ?? 80) - RESERVED_HORIZONTAL_SPACE,
    )
    visibleNamesLine = clampTextToLines(
      namesLine,
      availableWidth,
      MAX_NAME_LINES,
    )
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
    <Box flexDirection="column" paddingX={1}>
      {count > 0 ? (
        <Text bold color={COLOR_WHITE}>
          Selected Skills{count > 0 ? ` (${count})` : ''}{' '}
          {count > 0 && (
            <Text color={copyStatusColor}> — {copyStatusText}</Text>
          )}
        </Text>
      ) : null}

      {count === 0 ? (
        <Text color={COLOR_GRAY}>
          No skills selected. Navigate results and press Space to select.
        </Text>
      ) : (
        <>
          <Text color={COLOR_WHITE}>{visibleNamesLine}</Text>
          <Box flexDirection="column" marginTop={1}>
            {visibleCommandLines.map((line, i) => (
              <Text key={i} color={COLOR_GRAY} wrap="truncate">
                {line}
              </Text>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
})
