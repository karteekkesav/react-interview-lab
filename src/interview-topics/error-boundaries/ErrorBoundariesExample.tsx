import { Component, type ErrorInfo, type ReactNode, useState } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.info('Error boundary caught:', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="status-box">
          Something broke in this section. The rest of the app can keep running.
        </div>
      )
    }

    return this.props.children
  }
}

function RiskyWidget({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error('Risky widget crashed while rendering')
  }

  return (
    <article className="demo-card">
      <div>
        <h3>Risky widget rendered</h3>
        <p>Error boundaries protect the surrounding UI.</p>
      </div>
    </article>
  )
}

export default function ErrorBoundariesExample() {
  const [shouldCrash, setShouldCrash] = useState(false)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setShouldCrash(true)}>
        Crash child widget
      </button>
      <ErrorBoundary>
        <RiskyWidget shouldCrash={shouldCrash} />
      </ErrorBoundary>
    </div>
  )
}
