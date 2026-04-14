import { render } from 'ink'
import { App } from './ui/App.tsx'

// Hide cursor while TUI is active
process.stdout.write('\x1B[?25l')

function cleanup() {
  process.stdout.write('\x1B[?25h') // restore cursor
  // Move cursor to end of output so the shell prompt appears below the TUI
  process.stdout.write('\n')
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
