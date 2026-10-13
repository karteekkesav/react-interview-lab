import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'success'

export default function UseEffectExample() {
  const [query, setQuery] = useState('react')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 500)

    return () => window.clearTimeout(timerId)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery) return

    setStatus('loading')
    const timerId = window.setTimeout(() => {
      setStatus('success')
    }, 700)

    return () => window.clearTimeout(timerId)
  }, [debouncedQuery])

  return (
    <div className="demo-stack">
      <label className="field-row">
        Search keyword
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="status-box">
        <strong>Status:</strong> {status}
        <br />
        <strong>Debounced query:</strong> {debouncedQuery || 'empty'}
      </div>
    </div>
  )
}
