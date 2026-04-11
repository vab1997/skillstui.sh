import { Box, Text } from 'ink'
// import Divider from 'ink-divider'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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
import Divider from './divider.tsx'
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

const __dirname = dirname(fileURLToPath(import.meta.url))
const { version } = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
)

export function App() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)
  const { handleSearch, debouncedSearch } = useSkillSearch({
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
        <Text color={COLOR_GRAY}>
          {SUBTITLE_LINES} - v{version}
        </Text>
      </Box>

      <Box marginTop={1}>
        <SearchInput
          value={state.query}
          onChange={(v) => {
            dispatch({ type: 'SET_QUERY', payload: v })
            if (v.trim().length >= 2) debouncedSearch(v)
          }}
          onSubmit={handleSearch}
          isFocused={state.focusedPanel === 'search'}
        />
      </Box>

      {state.query.trim().length === 1 && (
        <Text color={COLOR_GRAY}> Type at least 2 characters to search</Text>
      )}

      <Divider
        title="Skills"
        dividerColor={COLOR_GRAY}
        titleColor={COLOR_WHITE}
        paddingBottom={1}
      />

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

      <Divider
        title="Agents"
        dividerColor={COLOR_GRAY}
        titleColor={COLOR_WHITE}
        paddingBottom={1}
      />

      <AgentSelector
        selectedAgents={state.selectedAgents}
        focusedIndex={state.focusedAgentIndex}
        isFocused={state.focusedPanel === 'agents'}
        height={AGENT_LIST_HEIGHT}
      />

      <Divider
        title="Selection"
        dividerColor={COLOR_GRAY}
        titleColor={COLOR_WHITE}
        paddingBottom={1}
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
