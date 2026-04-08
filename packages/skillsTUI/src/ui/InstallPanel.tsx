import { Box, Text, useApp } from 'ink'
import Spinner from 'ink-spinner'
import { spawn } from 'node:child_process'
import { useEffect, useRef, useState } from 'react'
import {
  COLOR_GRAY,
  COLOR_GREEN,
  COLOR_RED,
  COLOR_WHITE,
  EXIT_DELAY_MS,
} from '../constants.ts'
import { UNIVERSAL_AGENTS, type Agent } from './agents.ts'
import type { Skill } from './types.ts'
import { generateInstallCommand } from './utils.ts'

const CONCURRENCY = 5

type SkillStatus = 'pending' | 'installing' | 'success' | 'failed'

interface SkillState {
  name: string
  status: SkillStatus
}

function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx'
}

export async function runCommand(
  args: string[],
): Promise<{ success: boolean; output: string }> {
  const [cmd, ...rest] = args
  return new Promise((resolve) => {
    const proc = spawn(cmd!, rest, { stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    proc.stdout.on('data', (d: Buffer) => {
      output += d.toString()
    })
    proc.stderr.on('data', (d: Buffer) => {
      output += d.toString()
    })
    proc.on('close', (code: number | null) =>
      resolve({ success: code === 0, output }),
    )
    proc.on('error', (err: Error) =>
      resolve({ success: false, output: err.message }),
    )
  })
}

async function installSkill(skill: Skill, agents: Agent[]) {
  const command = generateInstallCommand(skill, agents)
  return runCommand([getNpxCommand(), ...command.split(' ').slice(1)])
}

interface Props {
  skills: Skill[]
  additionalAgents: Map<string, Agent>
}

export function InstallPanel({ skills, additionalAgents }: Props) {
  const { exit } = useApp()
  const nextIdx = useRef(0)

  const [skillStates, setSkillStates] = useState<SkillState[]>(() =>
    skills.map((s) => ({ name: s.name, status: 'pending' })),
  )
  const [isDone, setIsDone] = useState(false)
  const [summary, setSummary] = useState({ installed: 0, failed: 0 })

  useEffect(() => {
    const allAgents = [...UNIVERSAL_AGENTS, ...[...additionalAgents.values()]]

    async function worker() {
      while (nextIdx.current < skills.length) {
        const idx = nextIdx.current++
        const skill = skills[idx]!

        setSkillStates((prev) =>
          prev.map((s, i) => (i === idx ? { ...s, status: 'installing' } : s)),
        )

        const result = await installSkill(skill, allAgents)

        setSkillStates((prev) =>
          prev.map((s, i) =>
            i === idx
              ? { ...s, status: result.success ? 'success' : 'failed' }
              : s,
          ),
        )
      }
    }

    const workers = Array.from(
      { length: Math.min(CONCURRENCY, skills.length) },
      () => worker(),
    )

    Promise.all(workers).then(() => {
      setSkillStates((prev) => {
        const installed = prev.filter((s) => s.status === 'success').length
        const failed = prev.filter((s) => s.status === 'failed').length
        setSummary({ installed, failed })
        setIsDone(true)
        return prev
      })
      setTimeout(() => {
        exit()
        process.exit(0)
      }, EXIT_DELAY_MS)
    })
  }, [])

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={COLOR_WHITE}
      paddingX={1}
      gap={1}
    >
      <Text bold color={COLOR_WHITE}>
        {isDone ? 'Installation Complete' : 'Installing...'}
      </Text>

      <Box flexDirection="column">
        {skillStates.map((s, i) => {
          if (s.status === 'pending') {
            return (
              <Text key={i} dimColor color={COLOR_GRAY}>
                {'   ◌ '}
                {s.name}
              </Text>
            )
          }
          if (s.status === 'installing') {
            return (
              <Box key={i}>
                <Text color={COLOR_GREEN}>
                  {'   '}
                  <Spinner type="dots" />
                </Text>
                <Text> {s.name}...</Text>
              </Box>
            )
          }
          if (s.status === 'success') {
            return (
              <Text key={i} color={COLOR_GREEN}>
                {'   ✔ '}
                {s.name}
              </Text>
            )
          }
          return (
            <Text key={i} color={COLOR_RED}>
              {'   ✘ '}
              {s.name}
              <Text dimColor> — failed</Text>
            </Text>
          )
        })}
      </Box>

      {isDone && (
        <Text color={summary.failed > 0 ? COLOR_RED : COLOR_GREEN}>
          {summary.installed} installed
          {summary.failed > 0 ? `, ${summary.failed} failed` : ''}
        </Text>
      )}
    </Box>
  )
}
