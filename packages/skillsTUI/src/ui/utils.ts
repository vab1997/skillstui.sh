import type { Agent } from "./agents"
import type { Skill } from "./types"

export function generateInstallCommand(skill: Skill, agents: Agent[]): string {
  const parts = skill.command.split(" ")
  const agentArgs = agents.flatMap((a) => ["-a", a.value])
  return ["npx", "-y", ...parts.slice(1), ...agentArgs, "-y"].join(" ")
}

// helper functions for the UI
export function openUrl(url: string) {
  const cmd =
    process.platform === "win32" ? "cmd"
    : process.platform === "darwin" ? "open"
    : "xdg-open"
  const args =
    process.platform === "win32" ? ["/c", "start", "", url] : [url]
  Bun.spawn([cmd, ...args])
}

export function copyToClipboard(text: string) {
  const [cmd, ...args] =
    process.platform === "win32" ? ["clip"] :
    process.platform === "darwin" ? ["pbcopy"] :
    ["xclip", "-selection", "clipboard"]
  const proc = Bun.spawn([cmd, ...args], { stdin: "pipe" })
  proc.stdin.write(text)
  proc.stdin.end()
}

export function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`
  return String(n)
}