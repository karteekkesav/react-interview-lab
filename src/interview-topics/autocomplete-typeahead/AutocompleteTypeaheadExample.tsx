import { useMemo, useState } from 'react'

const options = ['React', 'React Router', 'Redux', 'TypeScript', 'Testing Library']

export default function AutocompleteTypeaheadExample() {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const matches = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((index) => Math.min(index + 1, matches.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((index) => Math.max(index - 1, 0))
    }
    if (event.key === 'Enter' && matches[selectedIndex]) {
      event.preventDefault()
      setQuery(matches[selectedIndex])
    }
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Search topic
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSelectedIndex(0)
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={matches.length > 0}
        />
      </label>
      <ul className="demo-list">
        {matches.map((match, index) => (
          <li key={match}>
            <span>{match}</span>
            <strong>{index === selectedIndex ? 'Selected' : 'Option'}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
