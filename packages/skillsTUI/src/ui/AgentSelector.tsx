import { Box, Text } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import { memo, useRef } from 'react'
import {
  CHECKBOX_CHECKED,
  CHECKBOX_EMPTY,
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_WHITE,
} from '../constants.ts'
import { ADDITIONAL_AGENTS, UNIVERSAL_AGENTS, type Agent } from './agents.ts'
import Divider from './divider.tsx'

interface Props {
  selectedAgents: Map<string, Agent>
  focusedIndex: number
  isFocused: boolean
  height: number
}

export const AgentSelector = memo(function AgentSelector({
  selectedAgents,
  focusedIndex,
  isFocused,
  height,
}: Props) {
  const universalLabels = UNIVERSAL_AGENTS.map((a) => a.label).join(', ')

  const scrollOffsetRef = useRef(0)
  let scrollOffset = scrollOffsetRef.current
  if (focusedIndex < scrollOffset) {
    scrollOffset = focusedIndex
  } else if (focusedIndex >= scrollOffset + height) {
    scrollOffset = focusedIndex - height + 1
  }
  scrollOffsetRef.current = scrollOffset

  const totalAgents = ADDITIONAL_AGENTS.length
  const itemsAbove = scrollOffset
  const itemsBelow = Math.max(0, totalAgents - scrollOffset - height)

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={COLOR_GRAY} dimColor>
        Always included: {universalLabels}
      </Text>
      <Divider width={40} dividerColor={COLOR_GRAY} />
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
      <Text color={COLOR_GRAY} dimColor>
        ↑ {itemsAbove} more ↓ {itemsBelow} more
      </Text>
    </Box>
  )
})
