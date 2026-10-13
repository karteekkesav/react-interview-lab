import { useEffect, useState } from 'react'

export default function PollingExample() {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!enabled) return
    const intervalId = window.setInterval(() => setLastUpdated(new Date()), 1500)
    return () => window.clearInterval(intervalId)
  }, [enabled])

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setEnabled((value) => !value)}>
        {enabled ? 'Pause polling' : 'Resume polling'}
      </button>
      <p className="status-box">Last updated: {lastUpdated.toLocaleTimeString()}</p>
    </div>
  )
}
