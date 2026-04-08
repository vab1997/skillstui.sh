export type Agent = {
  value: string
  label: string
  hint: string
}

// Always included — passed as explicit -a flags to prevent CLI auto-detection
export const UNIVERSAL_AGENTS: Agent[] = [
  { value: 'amp', label: 'Amp', hint: '.agents/skills/' },
  { value: 'antigravity', label: 'Antigravity', hint: '.agents/skills/' },
  { value: 'cline', label: 'Cline', hint: '.agents/skills/' },
  { value: 'codex', label: 'Codex', hint: '.agents/skills/' },
  { value: 'cursor', label: 'Cursor', hint: '.agents/skills/' },
  { value: 'deepagents', label: 'Deep Agents', hint: '.agents/skills/' },
  { value: 'firebender', label: 'Firebender', hint: '.agents/skills/' },
  { value: 'gemini-cli', label: 'Gemini CLI', hint: '.agents/skills/' },
  { value: 'github-copilot', label: 'GitHub Copilot', hint: '.agents/skills/' },
  { value: 'kimi-cli', label: 'Kimi Code CLI', hint: '.agents/skills/' },
  { value: 'opencode', label: 'OpenCode', hint: '.agents/skills/' },
  { value: 'replit', label: 'Replit', hint: '.agents/skills/' },
  { value: 'warp', label: 'Warp', hint: '.agents/skills/' },
]

// Require explicit -a flag when selected
export const ADDITIONAL_AGENTS: Agent[] = [
  { value: 'adal', label: 'AdaL', hint: '.adal/skills/' },
  { value: 'augment', label: 'Augment', hint: '.augment/skills/' },
  { value: 'bob', label: 'IBM Bob', hint: '.bob/skills/' },
  { value: 'claude-code', label: 'Claude Code', hint: '.claude/skills/' },
  { value: 'codebuddy', label: 'CodeBuddy', hint: '.codebuddy/skills/' },
  {
    value: 'command-code',
    label: 'Command Code',
    hint: '.commandcode/skills/',
  },
  { value: 'continue', label: 'Continue', hint: '.continue/skills/' },
  { value: 'cortex', label: 'Cortex Code', hint: '.cortex/skills/' },
  { value: 'crush', label: 'Crush', hint: '.crush/skills/' },
  { value: 'droid', label: 'Droid', hint: '.factory/skills/' },
  { value: 'goose', label: 'Goose', hint: '.goose/skills/' },
  { value: 'iflow-cli', label: 'iFlow CLI', hint: '.iflow/skills/' },
  { value: 'junie', label: 'Junie', hint: '.junie/skills/' },
  { value: 'kilo', label: 'Kilo Code', hint: '.kilocode/skills/' },
  { value: 'kiro-cli', label: 'Kiro CLI', hint: '.kiro/skills/' },
  { value: 'kode', label: 'Kode', hint: '.kode/skills/' },
  { value: 'mcpjam', label: 'MCPJam', hint: '.mcpjam/skills/' },
  { value: 'mistral-vibe', label: 'Mistral Vibe', hint: '.vibe/skills/' },
  { value: 'mux', label: 'Mux', hint: '.mux/skills/' },
  { value: 'neovate', label: 'Neovate', hint: '.neovate/skills/' },
  { value: 'openclaw', label: 'OpenClaw', hint: 'skills/' },
  { value: 'openhands', label: 'OpenHands', hint: '.openhands/skills/' },
  { value: 'pi', label: 'Pi', hint: '.pi/skills/' },
  { value: 'pochi', label: 'Pochi', hint: '.pochi/skills/' },
  { value: 'qoder', label: 'Qoder', hint: '.qoder/skills/' },
  { value: 'qwen-code', label: 'Qwen Code', hint: '.qwen/skills/' },
  { value: 'roo', label: 'Roo Code', hint: '.roo/skills/' },
  { value: 'trae', label: 'Trae', hint: '.trae/skills/' },
  { value: 'trae-cn', label: 'Trae CN', hint: '.trae/skills/' },
  { value: 'windsurf', label: 'Windsurf', hint: '.windsurf/skills/' },
  { value: 'zencoder', label: 'Zencoder', hint: '.zencoder/skills/' },
]
