import { spawn } from 'node:child_process'
import { UNIVERSAL_AGENTS, type Agent } from './agents'
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

export function truncateLine(text: string, maxWidth: number): string {
  if (text.length <= maxWidth) return text
  return text.slice(0, maxWidth - 1) + '…'
}

const getTextWidth = (value: string) => [...value].length

const truncateLineWithEllipsis = (line: string, maxWidth: number) => {
  if (maxWidth <= 0) {
    return ''
  }

  const ellipsis = '...'
  if (getTextWidth(line) + getTextWidth(ellipsis) <= maxWidth) {
    return `${line}${ellipsis}`
  }

  let truncatedLine = ''
  for (const char of line) {
    if (getTextWidth(truncatedLine + char + ellipsis) > maxWidth) {
      break
    }

    truncatedLine += char
  }

  if (truncatedLine.length > 0) {
    return `${truncatedLine}${ellipsis}`
  }

  return ellipsis.slice(0, maxWidth)
}

const wrapText = (text: string, maxWidth: number) => {
  if (!text || maxWidth <= 0) {
    return []
  }

  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const candidateLine = currentLine ? `${currentLine} ${word}` : word
    if (getTextWidth(candidateLine) <= maxWidth) {
      currentLine = candidateLine
      continue
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    if (getTextWidth(word) <= maxWidth) {
      currentLine = word
      continue
    }

    let remainingWord = word
    while (getTextWidth(remainingWord) > maxWidth) {
      const slice = [...remainingWord].slice(0, maxWidth).join('')
      lines.push(slice)
      remainingWord = [...remainingWord].slice(maxWidth).join('')
    }

    currentLine = remainingWord
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

export function clampTextToLines(
  text: string,
  maxWidth: number,
  maxLines: number,
): string {
  if (!text || maxWidth <= 0 || maxLines <= 0) {
    return ''
  }

  const wrappedLines = wrapText(text, maxWidth)

  if (wrappedLines.length <= maxLines) {
    return wrappedLines.join('\n')
  }

  const visibleLines = wrappedLines.slice(0, maxLines)
  const lastVisibleLine = visibleLines[maxLines - 1]!.trimEnd()
  visibleLines[maxLines - 1] = truncateLineWithEllipsis(
    lastVisibleLine,
    maxWidth,
  )

  return visibleLines.join('\n')
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export function buildFullCommand(
  selectedSkills: Map<string, Skill>,
  selectedAgents: Map<string, Agent>,
): string {
  const allAgents = [...UNIVERSAL_AGENTS, ...[...selectedAgents.values()]]
  return [...selectedSkills.values()]
    .map((skill) => generateInstallCommand(skill, allAgents))
    .join(' &&\n')
}

export function buildDisplayCommand(
  selectedSkills: Map<string, Skill>,
  selectedAgents: Map<string, Agent>,
): string {
  const agents = [...selectedAgents.values()]
  return [...selectedSkills.values()]
    .map((skill) => generateInstallCommand(skill, agents))
    .join(' &&\n')
}
