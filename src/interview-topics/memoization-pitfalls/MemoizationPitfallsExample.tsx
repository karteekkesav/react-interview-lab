import { memo, useMemo, useState } from 'react'

const Child = memo(function Child({ config }: { config: { label: string } }) {
  return <p className="status-box">Child received: {config.label}</p>
})

export default function MemoizationPitfallsExample() {
  const [count, setCount] = useState(0)
  const config = useMemo(() => ({ label: 'Stable object prop' }), [])

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Parent render {count}
      </button>
      <Child config={config} />
    </div>
  )
}
