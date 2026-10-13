import { useState } from 'react'

const initialItems = [
  { id: 'a', label: 'Stable key A' },
  { id: 'b', label: 'Stable key B' },
  { id: 'c', label: 'Stable key C' },
]

export default function ReconciliationExample() {
  const [items, setItems] = useState(initialItems)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setItems((current) => [...current].reverse())}>
        Reverse list
      </button>
      <ul className="demo-list">
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.label}</span>
            <input aria-label={item.label} placeholder="State stays with key" />
          </li>
        ))}
      </ul>
    </div>
  )
}
