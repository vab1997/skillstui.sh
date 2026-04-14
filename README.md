# skillstui.sh

<a href="https://skillstui.sh">
<img src="https://skillstui.sh/img-readme.png" alt="skillstui" />
</a>

Website and CLI for [skillstui.sh](https://skillstui.sh) — a terminal UI for discovering and installing AI agent skills from the [Open Agent Skills Ecosystem](https://skills.sh).

## What's in this repo

```
/
├── src/                    # Astro marketing site (skillstui.sh)
│   ├── components/         # React + Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes
│   └── styles/             # Global CSS
│
└── packages/
    └── skillsTUI/          # The CLI published to npm as `skillstui`
        └── src/
            ├── api.ts      # skills.sh API client
            ├── clipboard.ts
            ├── constants.ts
            └── ui/         # Ink/React components and app logic
```

## Getting started

### Website

```bash
bun install
bun dev        # localhost:4321
bun build      # builds to dist/
bun preview
```

### CLI (packages/skillsTUI)

```bash
cd packages/skillsTUI
bun install
bun run dev    # run the TUI
bun run build  # compile to dist/
```

## Tech stack

| Layer      | Tech                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| Website    | [Astro](https://astro.build) + React + Tailwind                                     |
| CLI        | [Bun](https://bun.sh) + [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) |
| Skills API | [skills.sh](https://skills.sh)                                                      |

## Contributing

PRs welcome!

### Prerequisites

- [Bun](https://bun.sh) — used exclusively as runtime, package manager, and test runner (no npm, yarn, or pnpm)
- Node.js ≥ 22.12.0

### Setup

```bash
git clone https://github.com/victorbejas/skillstui.sh.git
cd skillstui.sh
bun install
```

### Website (`/`)

The marketing and documentation site runs on Astro.

```bash
bun dev        # dev server → localhost:4321
bun build      # production build → dist/
bun preview    # preview production build locally
bun lint       # ESLint + Prettier check
bun format     # Prettier auto-fix
```

### CLI (`packages/skillsTUI`)

The terminal UI published to npm as `skillstui`.

```bash
cd packages/skillsTUI
bun install

bun run build          # compile to dist/
bun run start          # run the TUI directly
bun run dev            # watch mode — recompiles on file changes
bun test               # run test suite
```

### Project structure

```
/
├── src/                    # Astro marketing site
└── packages/
    └── skillsTUI/          # CLI source
        └── src/
            ├── api.ts      # skills.sh API client
            ├── clipboard.ts
            ├── constants.ts
            └── ui/         # Ink/React components and app logic
```

### Guidelines

- Use **Bun** for everything — no npm, yarn, or pnpm
- Run `bun test` before opening a PR
- Follow the existing code style (Prettier handles formatting)

## License

MIT — see [packages/skillsTUI/LICENSE](./packages/skillsTUI/LICENSE)
