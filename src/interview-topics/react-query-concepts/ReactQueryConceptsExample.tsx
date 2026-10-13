import { useState } from 'react'

type CacheEntry = {
  data: string
  updatedAt: number
}

export default function ReactQueryConceptsExample() {
  const [cache, setCache] = useState<CacheEntry>({
    data: 'Cached movie list',
    updatedAt: Date.now(),
  })
  const [isFetching, setIsFetching] = useState(false)

  function refetch() {
    setIsFetching(true)
    window.setTimeout(() => {
      setCache({ data: 'Fresh movie list', updatedAt: Date.now() })
      setIsFetching(false)
    }, 700)
  }

  return (
    <div className="demo-stack">
      <p className="status-box">
        <strong>Data:</strong> {cache.data}
        <br />
        <strong>Status:</strong> {isFetching ? 'fetching in background' : 'fresh'}
      </p>
      <button type="button" onClick={refetch}>
        Invalidate and refetch
      </button>
    </div>
  )
}
