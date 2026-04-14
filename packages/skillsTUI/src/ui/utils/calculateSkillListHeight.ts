// Approximate line count for all UI content excluding the ScrollList viewport.
// Breakdown: logo(6) + subtitle(1) + search margin+input(2) + divider Skills(2) +
// skillList header+margin(2) + divider Agents(2) + agentSelector(10) +
// divider Selection(2) + selectionPanel(2) + helpText(2) + paddingBottom(2) = 33.
export const FIXED_CONTENT_LINES = 33

export const MIN_SKILL_LIST_HEIGHT = 5
// Cap at 10 visible results (each SkillCard = 3 lines: name + source + margin).
export const MAX_SKILL_LIST_HEIGHT = 30

export function calculateSkillListHeight(terminalRows: number): number {
  const available = terminalRows - FIXED_CONTENT_LINES
  return Math.min(MAX_SKILL_LIST_HEIGHT, Math.max(MIN_SKILL_LIST_HEIGHT, available))
}
