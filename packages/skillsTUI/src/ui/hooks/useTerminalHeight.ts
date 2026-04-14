import { useEffect, useState } from 'react'

type Setter = (rows: number) => void
const setters = new Set<Setter>()
let currentRows = process.stdout.rows ?? 24

process.stdout.on('resize', () => {
  currentRows = process.stdout.rows ?? 24
  for (const set of setters) {
    set(currentRows)
  }
})

export function useTerminalHeight(): number {
  const [rows, setRows] = useState(currentRows)

  useEffect(() => {
    setters.add(setRows)
    return () => {
      setters.delete(setRows)
    }
  }, [])

  return rows
}
