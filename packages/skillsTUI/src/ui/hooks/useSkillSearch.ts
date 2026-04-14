import { useCallback, useEffect, useRef, type Dispatch } from 'react'
import { searchSkills } from '../../api.ts'
import type { Action } from '../store.ts'
import { useDebounceCallback } from './useDebounceCallback.ts'

interface UseSkillSearchArgs {
  dispatch: Dispatch<Action>
  initialQuery: string
}

export function useSkillSearch({ dispatch, initialQuery }: UseSkillSearchArgs) {
  const searchIdRef = useRef(0)

  const executeSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return

      const searchId = ++searchIdRef.current
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        const { skills } = await searchSkills(trimmed)
        if (searchId !== searchIdRef.current) return

        dispatch({ type: 'SET_RESULTS', payload: skills })
        dispatch({ type: 'SET_LAST_QUERY', payload: trimmed })

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

  const debouncedSearch = useDebounceCallback(executeSearch, 1000)

  // Enter: cancel pending debounce, fire immediately (guard: 2+ chars required)
  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch.cancel()
      if (query.trim().length < 2) return
      void executeSearch(query)
    },
    [debouncedSearch, executeSearch],
  )

  // Initial query fires directly (no debounce)
  useEffect(() => {
    void executeSearch(initialQuery)
  }, [executeSearch, initialQuery])

  return { handleSearch, debouncedSearch }
}
