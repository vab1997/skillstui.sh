import { Box, Text } from 'ink'
import { memo, useReducer } from 'react'
import {
  COLOR_GRAY,
  COLOR_WHITE,
  LOGO_LINES,
  SUBTITLE_LINES,
} from '../constants.ts'
import { AgentSelector } from './AgentSelector.tsx'
import { HelpText } from './HelpText.tsx'
import { InstallPanel } from './InstallPanel.tsx'
import { SearchInput } from './SearchInput.tsx'
import { SelectionPanel } from './SelectionPanel.tsx'
import { SkillList } from './SkillList.tsx'
import { useAppKeyboardNavigation } from './hooks/useAppKeyboardNavigation.ts'
import { useSkillSearch } from './hooks/useSkillSearch.ts'
import { getInitialState, reducer } from './store.ts'

const SKILL_LIST_HEIGHT = 30
const AGENT_LIST_HEIGHT = 5
const INITIAL_QUERY = getInitialState().query

const Logo = memo(function Logo() {
  return (
    <Box flexDirection="column">
      {LOGO_LINES.map((line, i) => (
        <Text key={i} color={COLOR_WHITE}>
          {line}
        </Text>
      ))}
    </Box>
  )
})

export function App() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)
  const { handleSearch } = useSkillSearch({
    dispatch,
    initialQuery: INITIAL_QUERY,
  })

  useAppKeyboardNavigation({ state, dispatch })

  if (state.isInstalling) {
    return (
      <Box flexDirection="column" paddingX={1}>
        <Logo />
        <InstallPanel
          skills={[...state.selectedSkills.values()]}
          additionalAgents={state.selectedAgents}
        />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={2}>
      <Box flexDirection="column">
        <Logo />
        <Text color={COLOR_GRAY}>{SUBTITLE_LINES}</Text>
      </Box>

      <Box marginTop={1}>
        <SearchInput
          value={state.query}
          onChange={(v) => dispatch({ type: 'SET_QUERY', payload: v })}
          onSubmit={handleSearch}
          isFocused={state.focusedPanel === 'search'}
        />
      </Box>

      <SkillList
        results={state.results}
        isLoading={state.isLoading}
        error={state.error}
        query={state.query}
        lastQuery={state.lastQuery}
        selectedSkills={state.selectedSkills}
        focusedIndex={state.focusedSkillIndex}
        height={SKILL_LIST_HEIGHT}
      />

      <AgentSelector
        selectedAgents={state.selectedAgents}
        focusedIndex={state.focusedAgentIndex}
        isFocused={state.focusedPanel === 'agents'}
        height={AGENT_LIST_HEIGHT}
      />

      <SelectionPanel
        selectedSkills={state.selectedSkills}
        selectedAgents={state.selectedAgents}
        copyStatus={state.copyStatus}
      />

      <HelpText />
    </Box>
  )
}
