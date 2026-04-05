# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tooling

Use **Bun** exclusively — not Node, npm, pnpm, or vite.

- `bun <file>` not `node <file>` or `ts-node <file>`
- `bun test` not jest/vitest
- `bun install` not npm/yarn/pnpm install
- `bunx <pkg>` not npx
- `Bun.file`, `Bun.spawn`, `Bun.$` instead of `node:fs`, `child_process`, execa
- Bun loads `.env` automatically — no dotenv

## Project Structure

This is a monorepo with two distinct packages:

**Root** — Astro marketing/documentation site (`src/`, `astro.config.mjs`)

- Serves the skillstui.sh website

**`packages/skillsTUI/`** — Terminal UI application (Bun + OpenTUI)

- Entry: `src/index.ts` → `src/ui/app.ts`
- Searches the skills.sh API and installs AI agent skills into local project directories

## Astro Site Commands (root)

```sh
bun dev          # localhost:4321
bun build        # dist/
bun preview
```

## TUI Commands (`packages/skillsTUI/`)

```sh
bun install
bun run src/index.ts   # run the TUI
bun test               # run tests
```

## TUI Architecture

The TUI is built with `@opentui/core` (imperative renderer, not React/Solid). All UI components are plain TypeScript classes/factories.

**Data flow:**

1. User types in `LabeledInput` → hits Enter → `createSkillSearchHandler` fires
2. Handler calls `searchSkills()` (hits `https://skills.sh/api/search`)
3. Results render as `SkillCard` components in a `ScrollBoxRenderable`
4. User selects skills → shown in `selectionPanelController`
5. `Ctrl+I` → `installPanel` runs `npx skills add ...` via `Bun.spawn` for each selected skill + agent combo

**Key modules:**

- `src/api.ts` — skills.sh API client, returns skills sorted by install count
- `src/ui/app.ts` — top-level layout wiring; owns the renderer lifecycle
- `src/ui/agents.ts` — `UNIVERSAL_AGENTS` (always installed) + `ADDITIONAL_AGENTS` (opt-in); each agent maps to a directory hint like `.claude/skills/`
- `src/ui/install-panel.ts` — runs `npx skills add` via `Bun.spawn`, shows spinner, exits after 3s
- `src/ui/types.ts` — shared `Renderer` and `Skill` types derived from `@opentui/core` and the API

**Global hotkeys** (wired in `app.ts`):

- `Ctrl+C` — exit
- `Ctrl+Y` — copy install commands to clipboard
- `Ctrl+I` — install selected skills

## Skills in `.claude/skills/` and `.agents/skills/`

These are Claude Code / multi-agent skill definitions (SKILL.md files), not application source code. They are installed artifacts managed by the `skills` CLI, not part of the TUI application logic itself.
