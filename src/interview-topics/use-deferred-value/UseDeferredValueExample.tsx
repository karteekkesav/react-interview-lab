import { useDeferredValue, useMemo, useState } from 'react'

const skills = Array.from({ length: 1500 }, (_, index) => `React skill ${index + 1}`)

export default function UseDeferredValueExample() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(
    () =>
      skills
        .filter((skill) => skill.toLowerCase().includes(deferredQuery.toLowerCase()))
        .slice(0, 8),
    [deferredQuery],
  )

  return (
    <div className="demo-stack">
      <label className="field-row">
        Search skills
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {query !== deferredQuery && <p className="status-box">Showing previous results...</p>}
      <ul className="demo-list">
        {results.map((skill) => (
          <li key={skill}>
            <span>{skill}</span>
            <strong>Deferred</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
