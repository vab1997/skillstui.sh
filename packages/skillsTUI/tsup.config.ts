import { builtinModules } from 'module'
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
    'fullscreen-ink',
  ],
  external: [
    'react-devtools-core',
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
  ],
  esbuildOptions(options) {
    options.banner = {
      js: [
        '#!/usr/bin/env node',
        "import { createRequire } from 'module';",
        'const require = createRequire(import.meta.url);',
      ].join('\n'),
    }
  },
})
