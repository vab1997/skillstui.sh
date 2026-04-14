import { Box, Text } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import Spinner from 'ink-spinner'
import { memo } from 'react'
import { COLOR_GRAY, COLOR_GREEN, COLOR_WHITE } from '../constants.ts'
import { SkillCard } from './SkillCard.tsx'
import type { Skill } from './types.ts'

interface Props {
  results: Skill[]
  isLoading: boolean
  error: string | null
  query: string
  lastQuery: string
  selectedSkills: Map<string, Skill>
  focusedIndex: number
  height: number
}

export const SkillList = memo(function SkillList({
  results,
  isLoading,
  error,
  query,
  lastQuery,
  selectedSkills,
  focusedIndex,
  height,
}: Props) {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold color={COLOR_WHITE}>
        Skill Results - {results.length} result{results.length !== 1 ? 's' : ''}{' '}
        for "{lastQuery}"
      </Text>

      {isLoading && (
        <Box>
          <Text color={COLOR_GREEN}>
            <Spinner type="dots" />
          </Text>
          <Text color={COLOR_GRAY}> Searching for "{query}"...</Text>
        </Box>
      )}

      {!isLoading && error && <Text color="#FF4444">{error}</Text>}

      {!isLoading &&
        !error &&
        results.length === 0 &&
        query.trim().length >= 2 && (
          <Text color={COLOR_GRAY}>No results found for "{query}"</Text>
        )}

      {!isLoading &&
        !error &&
        results.length === 0 &&
        query.trim().length === 1 && (
          <Text color={COLOR_GRAY}>Type at least 2 characters to search</Text>
        )}

      {!isLoading && !error && results.length === 0 && !query.trim() && (
        <Text color={COLOR_GRAY}>Type to search...</Text>
      )}

      {!isLoading && !error && results.length > 0 && (
        <>
          <ScrollList
            selectedIndex={focusedIndex}
            scrollAlignment="auto"
            height={height}
            marginTop={1}
          >
            {results.map((skill, i) => (
              <SkillCard
                key={`${skill.id}-${i}`}
                skill={skill}
                index={i}
                isSelected={selectedSkills.has(skill.id)}
                isFocused={focusedIndex === i}
              />
            ))}
          </ScrollList>
        </>
      )}
    </Box>
  )
})
