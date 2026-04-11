# Changelog

All notable changes to skillsTUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.9] - 2026-04-11

### Added

- Debounced search (500ms) — results appear automatically as you type, no Enter required; suggested by [@dcos96038](https://github.com/dcos96038)
- `useDebounceCallback` hook — reusable debounce primitive mirroring the `usehooks-ts` API
- `Divider` component (`divider.tsx`) — custom titled/plain horizontal rules replacing `ink-divider`
- Section dividers ("Skills", "Agents", "Selection") between layout panels in `App`
- Version string displayed in the subtitle line (read from `package.json` at runtime)
- Inline hint below search input when query is less than 2 characters
- `clampTextToLines` utility — responsive word-wrap with ellipsis truncation; used in `SelectionPanel`
- `[Shift+Tab] previous panel` added to help bar

### Changed

- Search placeholder updated to `type to search...`
- Minimum query length enforced at 2 characters (both debounce and Enter paths)
- Enter key now cancels any pending debounce timer and fires the search immediately
- `AgentSelector`, `SkillList`, and `SelectionPanel` borders/titles removed — sections are now separated by `Divider` components in `App`
- Selected skill names in `SelectionPanel` wrap responsively up to 3 lines (terminal width-aware)
- Empty-state messages in `SkillList` updated to match new search UX
- `handleSearch` renamed internally to `executeSearch`; `useSkillSearch` now returns both `handleSearch` and `debouncedSearch`

### Fixed

- Typo in ASCII logo (`██╗` → `██║` on the last filled row)

## [0.2.8] - 2026-04-09

### Added

- `lastQuery` state to track the most recent successfully executed search query

## [0.2.7] - 2026-04-09

### Changed

- Version bump following fullscreen integration stabilization

## [0.2.6] - 2026-04-09

### Added

- `fullscreen-ink` dependency for true fullscreen terminal rendering

## [0.2.5] - 2026-04-08

### Added

- Opt-in additional agents support documented in README

### Changed

- Code formatting improvements across UI components

## [0.2.4] - 2026-04-07

### Changed

- Help text formatting: replaced `{'Ctrl+C'}` JSX syntax with plain `[Ctrl+C]` brackets
- Vercel Analytics integrated into the marketing site

## [0.2.3] - 2026-04-07

### Changed

- `tsup` configuration further enhanced for improved bundling reliability

## [0.2.2] - 2026-04-07

### Fixed

- CLI bundling: switched to `noExternal` in tsup config to inline React, Ink, and related dependencies — resolves dual-React and CJS/ESM issues on install

## [0.2.1] - 2026-04-07

### Added

- GitHub Actions workflow for automated publishing to npm
- Issue templates for bug reports, feature requests, and general feedback

## [0.2.0] - 2026-04-07

### Changed

- Version bump to mark the React/Ink migration as stable

## [0.1.1] - 2026-04-07

### Added

- Full React/Ink UI rewrite — replaced imperative OpenTUI renderer with React components
- `App`, `SearchInput`, `SkillList`, `SkillCard`, `SelectionPanel`, `AgentSelector`, `InstallPanel`, `HelpText` components
- `useSkillSearch` and `useAppKeyboardNavigation` hooks
- `store.ts` — centralized reducer for app state
- `skills-lock.json` for managing installed skill dependencies

### Removed

- Legacy imperative OpenTUI components (`app.ts`, `skill-card.ts`, `selection-panel.ts`, `install-panel.ts`, `keyboard-nav-controller.ts`, `labeled-input.ts`, `skill-search-handler.ts`, `copy-to-clipboard.ts`)

## [0.1.0] - 2026-04-06

### Added

- Initial skillsTUI package — terminal UI for discovering and installing Claude Code / multi-agent skills
- `searchSkills()` API client hitting `https://skills.sh/api/search`, sorted by install count
- Imperative OpenTUI renderer with skill search, selection panel, agent selector, and install panel
- Clipboard support (`Ctrl+Y`) and install via `npx skills add` (`Ctrl+I`)
- `Ctrl+C` to exit
