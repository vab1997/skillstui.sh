import { useEffect, useState } from 'react'

// Single module-level listener shared across all hook instances.
// Prevents N listeners (one per SkillCard) from triggering MaxListenersExceededWarning.
type Setter = (cols: number) => void
const setters = new Set<Setter>()
let currentColumns = process.stdout.columns ?? 80

process.stdout.on('resize', () => {
  currentColumns = process.stdout.columns ?? 80
  for (const set of setters) {
    set(currentColumns)
  }
})

export function useTerminalWidth(): number {
  const [columns, setColumns] = useState(currentColumns)

  useEffect(() => {
    setters.add(setColumns)
    return () => {
      setters.delete(setColumns)
    }
  }, [])

  return columns
}
