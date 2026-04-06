import { createCliRenderer } from '@opentui/core'

export type Renderer = Awaited<ReturnType<typeof createCliRenderer>>

export interface Skill {
  id: string
  skillId: string
  name: string
  url: string
  command: string
  installs: number
  source: string
}
