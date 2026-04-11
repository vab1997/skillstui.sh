import { useCallback, useEffect, useRef } from 'react'

interface DebouncedFunction<T extends (...args: Parameters<T>) => void> {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function useDebounceCallback<T extends (...args: Parameters<T>) => void>(
  func: T,
  delay = 500,
): DebouncedFunction<T> {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const funcRef = useRef(func)

  // Keep funcRef in sync with the latest func without recreating the debounced fn
  useEffect(() => {
    funcRef.current = func
  }, [func])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      cancel()
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        funcRef.current(...args)
      }, delay)
    },
    [cancel, delay],
  ) as DebouncedFunction<T>

  debounced.cancel = cancel

  // Cleanup on unmount
  useEffect(() => cancel, [cancel])

  return debounced
}
