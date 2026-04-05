import eslintPluginAstro from 'eslint-plugin-astro'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'packages/skillsTUI/node_modules/',
    ],
  },
]
