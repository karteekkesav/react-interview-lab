import { lazy, Suspense, useState } from 'react'

const HeavyInterviewPanel = lazy(() => import('./HeavyInterviewPanel'))

export default function LazyLoadingExample() {
  const [showPanel, setShowPanel] = useState(false)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setShowPanel(true)}>
        Load advanced panel
      </button>
      {showPanel && (
        <Suspense fallback={<p className="status-box">Loading panel...</p>}>
          <HeavyInterviewPanel />
        </Suspense>
      )}
    </div>
  )
}
