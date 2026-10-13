import { useEffect, useState } from 'react'

function fakeFetch(signal: AbortSignal) {
  return new Promise<string>((resolve, reject) => {
    const timerId = window.setTimeout(() => resolve('Request completed'), 1000)

    signal.addEventListener('abort', () => {
      window.clearTimeout(timerId)
      reject(new DOMException('Request aborted', 'AbortError'))
    })
  })
}

export default function AbortControllerExample() {
  const [requestId, setRequestId] = useState(1)
  const [status, setStatus] = useState('Waiting')

  useEffect(() => {
    const controller = new AbortController()
    setStatus(`Loading request ${requestId}`)

    fakeFetch(controller.signal)
      .then((message) => setStatus(`${message}: ${requestId}`))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') setStatus(error.message)
      })

    return () => controller.abort()
  }, [requestId])

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setRequestId((value) => value + 1)}>
        Start next request
      </button>
      <p className="status-box">{status}</p>
    </div>
  )
}
