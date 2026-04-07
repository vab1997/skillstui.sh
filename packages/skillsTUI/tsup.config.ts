import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  bundle: true,
  clean: true,
  noExternal: [
    'react',
    'react-reconciler',
    'scheduler',
    'ink',
    'ink-scroll-list',
    'ink-spinner',
    'ink-text-input',
  ],
  external: ['react-devtools-core'],
  banner: {
    js: '#!/usr/bin/env node',
  },
})
