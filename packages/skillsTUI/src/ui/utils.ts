import { spawn } from 'node:child_process'
import type { Agent } from './agents'
import type { Skill } from './types'

export function generateInstallCommand(skill: Skill, agents: Agent[]): string {
  const parts = skill.command.split(' ')
  const agentArgs = agents.flatMap((a) => ['-a', a.value])
  return ['npx', '-y', ...parts.slice(1), ...agentArgs, '-y'].join(' ')
}

export function openUrl(url: string) {
  const cmd =
    process.platform === 'win32'
      ? 'cmd'
      : process.platform === 'darwin'
        ? 'open'
        : 'xdg-open'
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url]
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref()
}

export function formatInstallCount(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}
