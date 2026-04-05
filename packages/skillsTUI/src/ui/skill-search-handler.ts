import {
  ScrollBoxRenderable,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import { searchSkills } from '../api'
import { COLOR_GRAY, COLOR_RED } from '../constants'
import { SkillCard } from './skill-card'
import type { Renderer, Skill } from './types'

const RESULTS_PLACEHOLDER_ID = 'results-placeholder'

type CreateSkillSearchHandlerOptions = {
  renderer: Renderer
  resultsScroll: ScrollBoxRenderable
  resultsStatus: TextRenderable
  selectedSkills: Map<string, Skill>
  toggleSkill: (skill: Skill) => void
}

const clearScrollResults = (resultsScroll: ScrollBoxRenderable) => {
  for (const child of resultsScroll.getChildren()) {
    resultsScroll.remove(child.id)
  }
}

const setStatus = (resultsStatus: TextRenderable, content: string) => {
  resultsStatus.content = stringToStyledText(content)
}

const addResultsPlaceholder = (
  renderer: Renderer,
  resultsScroll: ScrollBoxRenderable,
  content: string,
  fg: string,
) => {
  resultsScroll.add(
    new TextRenderable(renderer, {
      id: RESULTS_PLACEHOLDER_ID,
      content,
      fg,
    }),
  )
}

export const createSkillSearchHandler = ({
  renderer,
  resultsScroll,
  resultsStatus,
  selectedSkills,
  toggleSkill,
}: CreateSkillSearchHandlerOptions) => {
  let activeSearchId = 0

  return async (value: string) => {
    const query = value.trim()

    if (!query) {
      setStatus(resultsStatus, 'Enter a technology to start the search.')
      clearScrollResults(resultsScroll)
      addResultsPlaceholder(
        renderer,
        resultsScroll,
        'Try terms like react, nextjs, bun, or tailwind.',
        COLOR_GRAY,
      )
      return
    }

    activeSearchId += 1
    const searchId = activeSearchId

    setStatus(resultsStatus, `Searching for "${query}"...`)
    clearScrollResults(resultsScroll)
    addResultsPlaceholder(
      renderer,
      resultsScroll,
      'Contacting skills.sh API...',
      COLOR_GRAY,
    )

    try {
      const results = await searchSkills(query)

      if (searchId !== activeSearchId) {
        return
      }

      if (results.skills.length === 0) {
        setStatus(resultsStatus, `No results for "${query}".`)
        clearScrollResults(resultsScroll)
        addResultsPlaceholder(
          renderer,
          resultsScroll,
          'Try a broader term or a different spelling.',
          COLOR_GRAY,
        )
        return
      }

      setStatus(
        resultsStatus,
        `Found ${results.skills.length} result(s) for "${query}".`,
      )
      clearScrollResults(resultsScroll)
      results.skills.forEach((skill, index) => {
        resultsScroll.add(
          SkillCard(renderer, index, skill, selectedSkills, toggleSkill),
        )
      })
    } catch (error) {
      if (searchId !== activeSearchId) {
        return
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      setStatus(resultsStatus, `Search failed for "${query}".`)
      clearScrollResults(resultsScroll)
      addResultsPlaceholder(renderer, resultsScroll, message, COLOR_RED)
    }
  }
}
