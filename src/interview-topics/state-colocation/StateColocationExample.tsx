import { useState } from 'react'

function IndependentCounter({ label }: { label: string }) {
  const [count, setCount] = useState(0)
  return (
    <article className="demo-card">
      <div>
        <h3>{label}</h3>
        <p>State is colocated inside this counter.</p>
      </div>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        {count}
      </button>
    </article>
  )
}

export default function StateColocationExample() {
  return (
    <div className="demo-stack">
      <IndependentCounter label="Local filter panel" />
      <IndependentCounter label="Local details panel" />
    </div>
  )
}
