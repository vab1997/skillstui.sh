import React, { memo } from 'react'
import { Box, Text } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import {
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_WHITE,
  CHECKBOX_CHECKED,
  CHECKBOX_EMPTY,
} from '../constants.ts'
import { ADDITIONAL_AGENTS, UNIVERSAL_AGENTS, type Agent } from './agents.ts'

interface Props {
  selectedAgents: Map<string, Agent>
  focusedIndex: number
  isFocused: boolean
  height: number
}

export const AgentSelector = memo(function AgentSelector({ selectedAgents, focusedIndex, isFocused, height }: Props) {
  const universalLabels = UNIVERSAL_AGENTS.map((a) => a.label).join(', ')

  return (
    <Box flexDirection="column" borderStyle="single" borderColor={COLOR_GRAY} paddingX={1}>
      <Text color={COLOR_GRAY} bold>
        Agents
      </Text>
      <Text color={COLOR_GRAY} dimColor>
        Always included: {universalLabels}
      </Text>
      <Text color={COLOR_GRAY}>─────────────────────</Text>
      <Text color={COLOR_GRAY} dimColor>
        Additional agents (select with Space):
      </Text>
      <ScrollList
        selectedIndex={isFocused ? focusedIndex : -1}
        scrollAlignment="auto"
        height={height}
      >
        {ADDITIONAL_AGENTS.map((agent, i) => {
          const isSelected = selectedAgents.has(agent.value)
          const isRowFocused = isFocused && focusedIndex === i
          const checkbox = isSelected ? CHECKBOX_CHECKED : CHECKBOX_EMPTY
          const color = isSelected ? COLOR_GREEN : COLOR_WHITE
          const focusIndicator = isRowFocused ? '▶ ' : '  '

          return (
            <Box key={agent.value}>
              <Text color={COLOR_GREEN}>{focusIndicator}</Text>
              <Text color={color}>
                {checkbox} {agent.label}
              </Text>
              <Text color={COLOR_GRAY}> ({agent.hint})</Text>
            </Box>
          )
        })}
      </ScrollList>
    </Box>
  )
})
