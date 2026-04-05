import {
  BoxRenderable,
  KeyEvent,
  TextRenderable,
  stringToStyledText,
} from '@opentui/core'
import { COLOR_GREEN, COLOR_RED } from '../constants'
import { UNIVERSAL_AGENTS, type Agent } from './agents'
import type { Renderer, Skill } from './types'

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx'
}

async function runCommand(
  args: string[],
): Promise<{ success: boolean; output: string }> {
  const proc = Bun.spawn(args, {
    stdout: 'pipe',
    stderr: 'pipe',
    stdin: 'ignore',
  })
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ])
  return { success: (await proc.exited) === 0, output: stdout + stderr }
}

async function installSkill(
  skill: Skill,
  agents: Agent[],
): Promise<{ success: boolean; output: string }> {
  const parts = skill.command.split(' ')
  const agentArgs = agents.flatMap((a) => ['-a', a.value])
  return runCommand([
    getNpxCommand(),
    '-y',
    ...parts.slice(1),
    ...agentArgs,
    '-y',
  ])
}

export function createInstallPanelController(renderer: Renderer) {
  let installing = false

  const panel = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    borderColor: '#fff',
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
        `   ${SPINNER[frame]} Installing skills...`,
      )
    }, 80)

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
    }, 3000)
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
