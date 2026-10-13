import { useState } from 'react'

export default function GlobalErrorHandlingExample() {
  const [errorMessage, setErrorMessage] = useState('')

  function simulateError() {
    try {
      throw new Error('Payment service is unavailable')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(message)
      console.error('Report to monitoring:', message)
    }
  }

  return (
    <div className="demo-stack">
      <button type="button" onClick={simulateError}>
        Simulate handled error
      </button>
      {errorMessage && (
        <p className="status-box">
          We could not complete the action. Reason: {errorMessage}
        </p>
      )}
    </div>
  )
}
