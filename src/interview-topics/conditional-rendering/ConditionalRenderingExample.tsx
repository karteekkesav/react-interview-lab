import { useState } from 'react'

type ViewState = 'loading' | 'empty' | 'error' | 'success'

export default function ConditionalRenderingExample() {
  const [viewState, setViewState] = useState<ViewState>('success')

  return (
    <div className="demo-stack">
      <div className="segmented-control" aria-label="View state">
        {(['loading', 'empty', 'error', 'success'] as ViewState[]).map(
          (state) => (
            <button
              key={state}
              type="button"
              className={viewState === state ? 'selected' : ''}
              onClick={() => setViewState(state)}
            >
              {state}
            </button>
          ),
        )}
      </div>

      {viewState === 'loading' && <p className="status-box">Loading movies...</p>}
      {viewState === 'empty' && <p className="status-box">No movies found.</p>}
      {viewState === 'error' && (
        <p className="status-box">Something went wrong. Please retry.</p>
      )}
      {viewState === 'success' && (
        <article className="demo-card">
          <div>
            <h3>3 movies found</h3>
            <p>Render the success UI only when data exists.</p>
          </div>
        </article>
      )}
    </div>
  )
}
