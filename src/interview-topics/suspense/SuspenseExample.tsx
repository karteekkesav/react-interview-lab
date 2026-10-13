import { lazy, Suspense, useState } from 'react'

const DelayedSummary = lazy(
  () =>
    new Promise<typeof import('./DelayedSummary')>((resolve) => {
      window.setTimeout(() => {
        import('./DelayedSummary').then(resolve)
      }, 800)
    }),
)

export default function SuspenseExample() {
  const [showSummary, setShowSummary] = useState(false)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setShowSummary(true)}>
        Show Suspense content
      </button>
      {showSummary && (
        <Suspense fallback={<p className="status-box">Waiting for content...</p>}>
          <DelayedSummary />
        </Suspense>
      )}
    </div>
  )
}
