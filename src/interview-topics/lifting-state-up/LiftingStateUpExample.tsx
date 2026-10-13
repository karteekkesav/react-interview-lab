import { useState } from 'react'

function SearchBox({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (query: string) => void
}) {
  return (
    <label className="field-row">
      Shared search
      <input value={query} onChange={(event) => onQueryChange(event.target.value)} />
    </label>
  )
}

function ResultSummary({ query }: { query: string }) {
  return (
    <p className="status-box">
      <strong>Sibling sees:</strong> {query || 'No search yet'}
    </p>
  )
}

export default function LiftingStateUpExample() {
  const [query, setQuery] = useState('')

  return (
    <div className="demo-stack">
      <SearchBox query={query} onQueryChange={setQuery} />
      <ResultSummary query={query} />
    </div>
  )
}
