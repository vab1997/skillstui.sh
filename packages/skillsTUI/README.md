# skillstui

> Terminal UI for searching and installing AI agent skills from [skills.sh](https://skills.sh)

```
npx skillstui
```

---

## What is this?

`skillstui` is an interactive terminal app that lets you search, browse, and install **agent skills** — reusable instruction sets that supercharge AI coding agents like Claude Code, Cursor, GitHub Copilot, Windsurf, and many more.

Skills are fetched live from [skills.sh](https://skills.sh), sorted by community installs, and installed into your project with a single keystroke.

---

## Usage

No installation required:

```bash
npx skillstui
```

Or install globally:

```bash
npm install -g skillstui
skillstui
```

---

## How it works

1. **Search** — type a term and press `Enter` to search skills.sh
2. **Select** — click any result to add it to your install list
3. **Choose agents** — toggle additional agents in the panel below
4. **Install** — press `Ctrl+I` to install everything at once

---

## Keyboard shortcuts

| Key      | Action                            |
| -------- | --------------------------------- |
| `Enter`  | Search for skills                 |
| `Ctrl+I` | Install selected skills           |
| `Ctrl+Y` | Copy install command to clipboard |
| `Ctrl+C` | Exit                              |

---

## Supported agents

Skills are installed for **all** of the following agents by default:

Amp · Antigravity · Cline · Codex · Cursor · Deep Agents · Gemini CLI · GitHub Copilot · Kimi Code CLI · OpenCode · Replit · Warp

**Opt-in agents** (click to toggle in the TUI):

Augment · Claude Code · CodeBuddy · Command Code · Continue · Cortex Code · Crush · Goose · Junie · Kilo Code · Kiro CLI · Mistral Vibe · OpenClaw · OpenHands · Roo Code · Trae · Windsurf · Zencoder

---

## Requirements

- Node.js 18+ or Bun
- A terminal with mouse support (most modern terminals)

---

## License

MIT
