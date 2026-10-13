import { useEffect, useState } from 'react'

export default function HydrationConceptExample() {
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    setIsInteractive(true)
  }, [])

  return (
    <article className="demo-card">
      <div>
        <h3>{isInteractive ? 'Interactive' : 'Static HTML'}</h3>
        <p>Hydration attaches React behavior to server-rendered HTML.</p>
      </div>
      <button type="button" disabled={!isInteractive}>
        {isInteractive ? 'Ready' : 'Hydrating'}
      </button>
    </article>
  )
}
