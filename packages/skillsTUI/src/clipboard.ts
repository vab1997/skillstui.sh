import { spawn } from 'node:child_process'

export function getClipboardCommand(): [string, string[]] {
  if (process.platform === 'win32') return ['clip', []]
  if (process.platform === 'darwin') return ['pbcopy', []]
  return ['xclip', ['-selection', 'clipboard']]
}

export function copyToClipboard(text: string) {
  const [cmd, args] = getClipboardCommand()
  const proc = spawn(cmd, args, { stdio: ['pipe', 'ignore', 'ignore'] })
  proc.stdin!.write(text)
  proc.stdin!.end()
}
