import { LOGO } from '@/lib/logo'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import {
  ADDITIONAL_AGENTS,
  ALWAYS_INCLUDED_AGENTS,
  SKILLS_DATA,
} from './terminal-data'

const SEARCH_QUERY = 'vercel'

function formatInstalls(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function SkillstuiDemo() {
  const [phase, setPhase] = useState(0)
  const [typedSearch, setTypedSearch] = useState('')

  // Typing animation for search
  useEffect(() => {
    if (phase !== 0) return
    const timer = setTimeout(() => {
      if (typedSearch.length < SEARCH_QUERY.length) {
        setTypedSearch(SEARCH_QUERY.slice(0, typedSearch.length + 1))
      } else {
        setTimeout(() => setPhase(1), 500)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [typedSearch, phase])

  // Progress through phases
  useEffect(() => {
    if (phase === 1) {
      const timer = setTimeout(() => setPhase(2), 1000)
      return () => clearTimeout(timer)
    }
    if (phase === 2) {
      const timer = setTimeout(() => setPhase(3), 2000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const selectedSkills = SKILLS_DATA.filter((s) => s.selected)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full"
    >
      <div className="bg-background border-border w-full overflow-hidden rounded-lg border font-mono text-[11px] leading-relaxed shadow-2xl">
        {/* Window Chrome */}
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-muted-foreground ml-2 text-xs">skillstui</span>
        </div>

        {/* Terminal Content */}
        <div className="styled-scrollbar max-h-[600px] space-y-3 overflow-y-auto p-4">
          {/* Logo */}
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto text-[8px] leading-none select-none sm:text-[9px]"
          >
            {LOGO}
          </motion.pre>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] tracking-wide text-[#8b949e] uppercase"
          >
            TUI - THE OPEN AGENT SKILLS ECOSYSTEM
          </motion.p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#8b949e]"
          >
            Skills leaderboard:{' '}
            <span className="bg-[#21262d] px-1 text-[#c9d1d9]">
              {typedSearch}
              <span className="animate-pulse">▋</span>
            </span>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded border border-white"
              >
                <div className="border-b border-[#30363d] px-2 py-1">
                  <span className="text-[#8b949e]">─</span>
                  <span className="text-primary">Results</span>
                  <span className="text-[#8b949e]">─</span>
                </div>

                <div className="space-y-1 p-2">
                  <p className="mb-2 text-[#8b949e]">
                    Found 100 result(s) for &quot;{SEARCH_QUERY}&quot;.
                  </p>

                  <div style={{ overflow: 'hidden', height: '150px' }}>
                    {SKILLS_DATA.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="space-y-0.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 flex-1 items-start gap-1">
                            <span
                              className={
                                skill.selected
                                  ? 'text-[#3fb950]'
                                  : 'text-[#8b949e]'
                              }
                            >
                              [{skill.selected ? 'x' : ' '}]
                            </span>
                            <span
                              className={`${skill.selected ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}`}
                            >
                              {i + 1}.
                            </span>
                            <span
                              className={`font-semibold ${skill.selected ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}`}
                            >
                              {skill.name}
                            </span>
                            <span className="truncate text-[#8b949e]">
                              {skill.source} ({formatInstalls(skill.installs)}{' '}
                              installs)
                            </span>
                          </div>
                          <span className="shrink-0 cursor-pointer text-[#58a6ff] hover:underline">
                            show detail
                          </span>
                        </div>
                        <div className="pl-6 text-[10px] text-[#6e7681]">
                          npx skills add https://github.com/{skill.source}{' '}
                          --skill {skill.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Install Agents Section */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="rounded border border-white"
              >
                <div className="border-b border-[#30363d] px-2 py-1">
                  <span className="text-[#8b949e]">─</span>
                  <span className="text-primary">Install Agents</span>
                  <span className="text-[#8b949e]">─</span>
                </div>

                <div className="space-y-2 p-2">
                  <p className="text-[#8b949e]">
                    Always included:{' '}
                    <span className="text-[#6e7681]">
                      {ALWAYS_INCLUDED_AGENTS.join(' · ')}
                    </span>
                  </p>

                  <p className="text-[#8b949e]">
                    Additional (click to add -a flag):
                  </p>

                  <div style={{ overflow: 'hidden', height: '64px' }}>
                    {ADDITIONAL_AGENTS.map((agent) => (
                      <div
                        key={agent.name}
                        style={{ lineHeight: '16px' }}
                        className="text-[10px]"
                      >
                        <span
                          className={
                            agent.selected ? 'text-[#79c0ff]' : 'text-[#8b949e]'
                          }
                        >
                          [{agent.selected ? 'x' : ' '}]
                        </span>{' '}
                        <span
                          className={
                            agent.selected ? 'text-[#79c0ff]' : 'text-[#c9d1d9]'
                          }
                        >
                          {agent.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected Skills Section */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded border border-white"
              >
                <div className="border-b border-[#30363d] px-2 py-1">
                  <span className="text-[#8b949e]">─</span>
                  <span className="text-primary">
                    Selected Skills ({selectedSkills.length}) - Ctrl+Y to copy
                  </span>
                  <span className="text-[#8b949e]">─</span>
                </div>

                <div className="space-y-1 p-2">
                  <span className="text-[#c9d1d9]">
                    {selectedSkills.map((skill) => skill.name).join(' · ')}
                  </span>

                  <div className="space-y-0.5 pt-2 text-[10px] break-all text-[#6e7681]">
                    <p>
                      npx -y skills add
                      https://github.com/vercel-labs/agent-skills --skill
                      vercel-react-best-practices -a claude-code -a windsurf -y
                      &&
                    </p>
                    <p>
                      npx -y skills add https://github.com/vercel-labs/skills
                      --skill find-skills -a claude-code -a windsurf -y
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Installation Animation */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1 rounded border border-white px-2 py-1"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-500"
                >
                  Installing skills...
                </motion.p>
                {selectedSkills.map((skill, i) => (
                  <motion.p
                    key={skill.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.4 }}
                    className="text-green-500"
                  >
                    ✓ {skill.name} installed
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="pt-1 font-semibold text-green-500"
                >
                  {selectedSkills.length} skills installed successfully!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard Shortcuts */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border-t border-[#30363d] pt-2 text-[10px] text-[#6e7681]"
              >
                [Tab] next panel · [Shift+Tab] previous panel · [↑↓] move ·
                [Space] select · [S] detail · [Ctrl+G] install · [Ctrl+Y] copy ·
                [Ctrl+C] exit
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
