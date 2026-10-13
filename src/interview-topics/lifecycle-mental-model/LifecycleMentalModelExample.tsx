import { useEffect, useState } from 'react'

export default function LifecycleMentalModelExample() {
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<string[]>(['Render starts with count 0'])

  useEffect(() => {
    setLogs((current) => [`Effect ran for count ${count}`, ...current].slice(0, 5))

    return () => {
      setLogs((current) => [`Cleanup before next count ${count}`, ...current].slice(0, 5))
    }
  }, [count])

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Re-render with count {count}
      </button>
      <ul className="demo-list">
        {logs.map((log, index) => (
          <li key={`${log}-${index}`}>
            <span>{log}</span>
            <strong>Step</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
