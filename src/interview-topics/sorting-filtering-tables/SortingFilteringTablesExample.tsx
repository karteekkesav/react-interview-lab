import { useMemo, useState } from 'react'

const candidates = [
  { id: 1, name: 'Asha', score: 91 },
  { id: 2, name: 'Rohan', score: 86 },
  { id: 3, name: 'Meera', score: 94 },
]

export default function SortingFilteringTablesExample() {
  const [query, setQuery] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const visibleRows = useMemo(() => {
    return candidates
      .filter((candidate) =>
        candidate.name.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) =>
        sortDirection === 'asc' ? a.score - b.score : b.score - a.score,
      )
  }, [query, sortDirection])

  return (
    <div className="demo-stack">
      <label className="field-row">
        Filter by name
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <button
        type="button"
        onClick={() =>
          setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
        }
      >
        Sort score {sortDirection}
      </button>
      <ul className="demo-list">
        {visibleRows.map((candidate) => (
          <li key={candidate.id}>
            <span>{candidate.name}</span>
            <strong>{candidate.score}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
