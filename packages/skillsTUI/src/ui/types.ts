import { createCliRenderer } from "@opentui/core"
import { searchSkills } from "../api"

export type Renderer = Awaited<ReturnType<typeof createCliRenderer>>
export type Skill = Awaited<ReturnType<typeof searchSkills>>["skills"][number]