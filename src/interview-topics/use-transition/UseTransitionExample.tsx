import { useState, useTransition, type ChangeEvent } from 'react'

const items = Array.from({ length: 2500 }, (_, index) => `Candidate ${index + 1}`)
const maxGeneratedItems = 25000

function SearchFilterExample() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const visibleItems = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 8)

  return (
    <div className="demo-stack">
      <label className="field-row">
        Search candidates
        <input
          value={input}
          onChange={(event) => {
            const nextValue = event.target.value
            setInput(nextValue)
            startTransition(() => setQuery(nextValue))
          }}
        />
      </label>
      {isPending && <p className="status-box">Updating results...</p>}
      <ul className="demo-list">
        {visibleItems.map((item) => (
          <li key={item}>
            <span>{item}</span>
            <strong>Match</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GeneratedListExample() {
  const [search, setSearch] = useState('')
  const [list, setList] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const visibleList = list.slice(0, 20)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value
    setSearch(nextValue)

    startTransition(() => {
      const generatedItems: string[] = []

      for (let index = 0; index <= maxGeneratedItems; index += 1) {
        generatedItems.push(nextValue)
      }

      setList(generatedItems)
    })
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Input
        <input type="text" value={search} onChange={handleChange} />
      </label>

      {isPending ? (
        <p className="status-box">Loading generated list...</p>
      ) : (
        <div className="status-box">
          <span>Generated items: {list.length}</span>
          <strong>Showing first {visibleList.length}</strong>
        </div>
      )}

      <ul className="demo-list">
        {visibleList.map((item, index) => (
          <li key={`${item}-${index}`}>
            <span>{item || '(empty input)'}</span>
            <strong>#{index + 1}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function UseTransitionExample() {
  const [activeExample, setActiveExample] = useState<'search' | 'generated'>(
    'search',
  )

  return (
    <div className="demo-stack">
      <div className="segmented-control" aria-label="useTransition examples">
        <button
          type="button"
          className={activeExample === 'search' ? 'selected' : undefined}
          onClick={() => setActiveExample('search')}
        >
          Search filter
        </button>
        <button
          type="button"
          className={activeExample === 'generated' ? 'selected' : undefined}
          onClick={() => setActiveExample('generated')}
        >
          Generated list
        </button>
      </div>

      {activeExample === 'search' ? (
        <SearchFilterExample />
      ) : (
        <GeneratedListExample />
      )}
    </div>
  )
}
