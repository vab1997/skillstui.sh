export const SKILLS_API_BASE = 'https://skills.sh/api/search'
export const MAX_RESULTS = 10

export interface SkillsApiSkill {
  id: string
  skillId: string
  name: string
  installs: number
  source: string
  command: string
  url: string
}

async function apiSearchSkills({
  skill,
}: {
  skill: string
}) {
  const response = await fetch(
    `${SKILLS_API_BASE}?q=${encodeURIComponent(skill)}`,
  )

  if (!response.ok) {
    throw new Error(
      `Skills API error: ${response.status} ${response.statusText}`,
    )
  }

  const data = (await response.json()) as { skills: SkillsApiSkill[] }

  if (!Array.isArray(data.skills)) {
    throw new Error('Skills API returned an invalid payload')
  }

  return { results: data.skills }
}

export async function searchSkills(skill: string) {
  const { results: skillsResults } = await apiSearchSkills({ skill })

  const skills = skillsResults
    .map((skill) => ({
      id: skill.id,
      skillId: skill.skillId,
      name: skill.name,
      url: `https://skills.sh/${skill.id}`,
      command: `npx skills add https://github.com/${skill.source} --skill ${skill.name}`,
      installs: skill.installs,
      source: skill.source,
    }))
    .toSorted((a, b) => b.installs - a.installs)
  return { skillName: skill, skills }
}
