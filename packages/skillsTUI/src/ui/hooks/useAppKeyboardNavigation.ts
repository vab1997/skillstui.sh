import { useInput } from 'ink'
import { useEffect, useRef, type Dispatch } from 'react'
import { handleKeyboardNavigation } from '../keyboardNavigation.ts'
import type { Action, State } from '../store.ts'

interface UseAppKeyboardNavigationArgs {
  state: State
  dispatch: Dispatch<Action>
}

export function useAppKeyboardNavigation({
  state,
  dispatch,
}: UseAppKeyboardNavigationArgs) {
  const stateRef = useRef(state)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  useInput((input, key) => {
    handleKeyboardNavigation({
      state: stateRef.current,
      dispatch,
      input,
      key,
      copyTimerRef,
    })
  })
}
