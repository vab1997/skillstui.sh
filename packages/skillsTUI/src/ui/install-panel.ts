import { spawn } from 'node:child_process'
import {
  BoxRenderable,
  KeyEvent,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import {
  COLOR_GREEN,
  COLOR_RED,
  COLOR_WHITE,
  EXIT_DELAY_MS,
  SPINNER,
  SPINNER_INTERVAL_MS,
} from '../constants'
import { UNIVERSAL_AGENTS, type Agent } from './agents'
import type { Renderer, Skill } from './types'
import { generateInstallCommand } from './utils'

function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx'
}

async function runCommand(
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
  })
}

async function installSkill(
  skill: Skill,
  agents: Agent[],
): Promise<{ success: boolean; output: string }> {
  const command = generateInstallCommand(skill, agents)
  return runCommand([getNpxCommand(), ...command.split(' ').slice(1)])
}

export function createInstallPanelController(renderer: Renderer) {
  let installing = false

  const panel = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    borderColor: COLOR_WHITE,
    padding: 1,
    flexDirection: 'column',
    gap: 0,
    title: 'Installing...',
  })

  async function runInstalls(skills: Skill[], additionalAgents: Agent[]) {
    if (installing) return
    installing = true

    const statusText = new TextRenderable(renderer, {
      content: '   Installing skills...',
      fg: COLOR_GREEN,
    })
    panel.add(statusText)

    let frame = 0
    const timer = setInterval(() => {
      frame = (frame + 1) % SPINNER.length
      statusText.content = stringToStyledText(
        `   ${SPINNER[frame]!} Installing skills...`,
      )
    }, SPINNER_INTERVAL_MS)

    let installed = 0
    const failedNames: string[] = []

    for (const skill of skills) {
      const result = await installSkill(skill, additionalAgents)
      if (result.success) installed++
      else failedNames.push(skill.name)
    }

    clearInterval(timer)

    const failed = failedNames.length
    let summary = `   ${installed} installed`
    if (failed > 0) summary += `, ${failed} failed (${failedNames.join(', ')})`

    statusText.content = stringToStyledText(summary)
    statusText.fg = failed > 0 ? COLOR_RED : COLOR_GREEN
    panel.title = 'Installation Complete'

    setTimeout(() => {
      renderer.destroy()
      process.exit(0)
    }, EXIT_DELAY_MS)
  }

  return {
    panel,
    runInstalls,
    get installing() {
      return installing
    },
  }
}

export function installPanel(
  key: KeyEvent,
  installPanelController: ReturnType<typeof createInstallPanelController>,
  skills: Skill[],
  additionalAgents: Agent[],
  app: BoxRenderable,
) {
  if (key.ctrl && key.name === 'i') {
    if (installPanelController.installing) return
    if (skills.length === 0) return
    const agents = [...UNIVERSAL_AGENTS, ...additionalAgents]
    app.add(installPanelController.panel, 6)
    installPanelController.runInstalls(skills, agents)
  }
}
