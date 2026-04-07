import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  bundle: true,
  clean: true,
  external: ['react', 'react-dom', 'ink', 'ink-spinner', 'ink-text-input', 'ink-scroll-list'],
  banner: {
    js: '#!/usr/bin/env node',
  },
})
