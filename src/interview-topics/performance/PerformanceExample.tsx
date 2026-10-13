import { memo, useMemo, useState } from 'react'

type Skill = {
  id: number
  name: string
  score: number
}

const skills: Skill[] = [
  { id: 1, name: 'React', score: 92 },
  { id: 2, name: 'TypeScript', score: 88 },
  { id: 3, name: 'Testing', score: 79 },
  { id: 4, name: 'Performance', score: 84 },
]

const SkillRow = memo(function SkillRow({ skill }: { skill: Skill }) {
  return (
    <li>
      <span>{skill.name}</span>
      <strong>{skill.score}</strong>
    </li>
  )
})

export default function PerformanceExample() {
  const [query, setQuery] = useState('')
  const [minimumScore, setMinimumScore] = useState(80)

  const visibleSkills = useMemo(() => {
    return skills.filter(
      (skill) =>
        skill.score >= minimumScore &&
        skill.name.toLowerCase().includes(query.toLowerCase()),
    )
  }, [minimumScore, query])

  return (
    <div className="demo-stack">
      <label className="field-row">
        Search skill
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <label className="field-row">
        Minimum score: {minimumScore}
        <input
          type="range"
          min="70"
          max="95"
          value={minimumScore}
          onChange={(event) => setMinimumScore(Number(event.target.value))}
        />
      </label>
      <ul className="demo-list">
        {visibleSkills.map((skill) => (
          <SkillRow key={skill.id} skill={skill} />
        ))}
      </ul>
    </div>
  )
}
