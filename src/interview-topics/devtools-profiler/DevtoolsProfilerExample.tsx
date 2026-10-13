import { Profiler, useState } from 'react'

export default function DevtoolsProfilerExample() {
  const [count, setCount] = useState(0)
  const [lastRender, setLastRender] = useState('No profile data yet')

  return (
    <Profiler
      id="CounterProfiler"
      onRender={(id, phase, actualDuration) => {
        setLastRender(`${id} ${phase} render took ${actualDuration.toFixed(2)}ms`)
      }}
    >
      <div className="demo-stack">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Render count {count}
        </button>
        <p className="status-box">{lastRender}</p>
      </div>
    </Profiler>
  )
}
