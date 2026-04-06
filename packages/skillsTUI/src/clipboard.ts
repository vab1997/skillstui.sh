import { spawn } from 'node:child_process'

export function copyToClipboard(text: string) {
  const [cmd, ...args] =
    process.platform === 'win32'
      ? ['clip']
      : process.platform === 'darwin'
        ? ['pbcopy']
        : ['xclip', '-selection', 'clipboard']
  const proc = spawn(cmd!, args, { stdio: ['pipe', 'ignore', 'ignore'] })
  proc.stdin!.write(text)
  proc.stdin!.end()
}
