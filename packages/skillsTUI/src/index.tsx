import { withFullScreen } from 'fullscreen-ink'
import { App } from './ui/App.tsx'

const app = withFullScreen(<App />)
await app.start()
await app.waitUntilExit()
