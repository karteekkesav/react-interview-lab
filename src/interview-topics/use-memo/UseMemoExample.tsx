import { useMemo, useState } from 'react'

const candidates = [
  { id: 1, name: 'Aarav', score: 88, skill: 'React' },
  { id: 2, name: 'Meera', score: 94, skill: 'TypeScript' },
  { id: 3, name: 'Kabir', score: 81, skill: 'Testing' },
  { id: 4, name: 'Diya', score: 91, skill: 'React' },
]

export default function UseMemoExample() {
  const [minimumScore, setMinimumScore] = useState(85)
  const [onlyReact, setOnlyReact] = useState(false)

  const shortlistedCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => candidate.score >= minimumScore)
      .filter((candidate) => !onlyReact || candidate.skill === 'React')
      .sort((a, b) => b.score - a.score)
  }, [minimumScore, onlyReact])

  return (
    <div className="demo-stack">
      <label className="field-row">
        Minimum score: {minimumScore}
        <input
          type="range"
          min="75"
          max="95"
          value={minimumScore}
          onChange={(event) => setMinimumScore(Number(event.target.value))}
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={onlyReact}
          onChange={(event) => setOnlyReact(event.target.checked)}
        />
        React skill only
      </label>
      <ul className="demo-list">
        {shortlistedCandidates.map((candidate) => (
          <li key={candidate.id}>
            <span>{candidate.name}</span>
            <strong>
              {candidate.skill} - {candidate.score}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
