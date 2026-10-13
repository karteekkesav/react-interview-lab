import { useState } from 'react'

export default function EventBubblingCapturingExample() {
  const [logs, setLogs] = useState<string[]>([])

  function addLog(message: string) {
    setLogs((current) => [message, ...current].slice(0, 6))
  }

  return (
    <div className="demo-stack">
      <div
        className="demo-card"
        onClickCapture={() => addLog('Parent capture')}
        onClick={() => addLog('Parent bubble')}
      >
        <div>
          <h3>Parent area</h3>
          <p>Click the child button and inspect propagation order.</p>
        </div>
        <button
          type="button"
          onClickCapture={() => addLog('Child capture')}
          onClick={() => addLog('Child bubble')}
        >
          Child button
        </button>
      </div>
      <ul className="demo-list">
        {logs.map((log, index) => (
          <li key={`${log}-${index}`}>
            <span>{log}</span>
            <strong>{index + 1}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
