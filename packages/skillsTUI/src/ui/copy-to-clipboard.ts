import { stringToStyledText, type KeyEvent, type TextRenderable } from "@opentui/core"
import type { Skill } from "./types"
import { COLOR_GREEN, COLOR_RED } from "../constants"

export function copyToClipboard(text: string) {
  const [cmd, ...args] =
    process.platform === "win32" ? ["clip"] :
    process.platform === "darwin" ? ["pbcopy"] :
    ["xclip", "-selection", "clipboard"]
  const proc = Bun.spawn([cmd, ...args], { stdin: "pipe" })
  proc.stdin.write(text)
  proc.stdin.end()
}

export function globalCopyToClipboard(
  key: KeyEvent,
  selectedSkills: Map<string, Skill>,
  selectionStatus: TextRenderable,
  getCommandText: () => string,
) {
  if (!key.ctrl || key.name !== "y" || selectedSkills.size === 0) {
    return
  }

  key.preventDefault()
  key.stopPropagation()

  try {
    copyToClipboard(getCommandText())
    selectionStatus.content = stringToStyledText(
      `Copied ${selectedSkills.size} selected command(s) to clipboard.`,
    )
    selectionStatus.fg = COLOR_GREEN
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown clipboard error"
    selectionStatus.content = stringToStyledText(`Copy failed: ${message}`)
    selectionStatus.fg = COLOR_RED
  }
}