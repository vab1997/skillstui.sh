import { render } from 'ink'
import { App } from './ui/App.tsx'

// Enter alternate screen buffer — gives a clean canvas and prevents
// old output from bleeding through on resize (same approach as Claude Code, Gemini CLI)
process.stdout.write('\x1B[?1049h')
// Hide cursor while TUI is active
process.stdout.write('\x1B[?25l')

function cleanup() {
  process.stdout.write('\x1B[?25h') // restore cursor
  process.stdout.write('\x1B[?1049l') // exit alternate screen
}

process.on('exit', cleanup)
process.on('SIGINT', () => {
  cleanup()
  process.exit(0)
})
process.on('SIGTERM', () => {
  cleanup()
  process.exit(0)
})

render(<App />)
