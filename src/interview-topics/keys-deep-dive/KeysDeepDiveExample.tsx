import { useState } from 'react'

const players = [
  { id: 'a', name: 'Ada' },
  { id: 'b', name: 'Brendan' },
  { id: 'c', name: 'Catherine' },
]

export default function KeysDeepDiveExample() {
  const [reverse, setReverse] = useState(false)
  const orderedPlayers = reverse ? [...players].reverse() : players

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setReverse((value) => !value)}>
        Reverse order
      </button>
      <ul className="demo-list">
        {orderedPlayers.map((player) => (
          <li key={player.id}>
            <span>{player.name}</span>
            <input aria-label={`${player.name} note`} placeholder="Type a note" />
          </li>
        ))}
      </ul>
    </div>
  )
}
