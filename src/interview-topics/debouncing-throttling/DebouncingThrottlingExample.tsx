import { useEffect, useRef, useState } from 'react'

export default function DebouncingThrottlingExample() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [scrollEvents, setScrollEvents] = useState(0)
  const lastThrottleTime = useRef(0)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => window.clearTimeout(timerId)
  }, [query])

  function handleThrottledClick() {
    const now = Date.now()
    if (now - lastThrottleTime.current < 1000) return

    lastThrottleTime.current = now
    setScrollEvents((count) => count + 1)
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Debounced search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <button type="button" onClick={handleThrottledClick}>
        Throttled action
      </button>
      <p className="status-box">
        <strong>Debounced query:</strong> {debouncedQuery || 'Waiting...'}
        <br />
        <strong>Throttled count:</strong> {scrollEvents}
      </p>
    </div>
  )
}
