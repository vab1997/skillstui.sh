import { useCallback, useEffect, useRef, type Dispatch } from 'react'
import { searchSkills } from '../../api.ts'
import type { Action } from '../store.ts'

interface UseSkillSearchArgs {
  dispatch: Dispatch<Action>
  initialQuery: string
}

export function useSkillSearch({
  dispatch,
  initialQuery,
}: UseSkillSearchArgs) {
  const searchIdRef = useRef(0)

  const handleSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return

      const searchId = ++searchIdRef.current
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        const { skills } = await searchSkills(trimmed)
        if (searchId !== searchIdRef.current) return

        dispatch({ type: 'SET_RESULTS', payload: skills })

        if (skills.length > 0) {
          dispatch({ type: 'SET_FOCUS', payload: 'skills' })
        }
      } catch (error) {
        if (searchId !== searchIdRef.current) return

        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Search failed',
        })
      }
    },
    [dispatch],
  )

  useEffect(() => {
    void handleSearch(initialQuery)
  }, [handleSearch, initialQuery])

  return { handleSearch }
}
