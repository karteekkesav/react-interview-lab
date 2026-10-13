import { useEffect, useState } from 'react'

type Movie = {
  id: number
  title: string
  rating: number
}

type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: Movie[] }
  | { status: 'empty' }
  | { status: 'error'; message: string }

const mockMovies: Movie[] = [
  { id: 1, title: 'The Matrix', rating: 8.7 },
  { id: 2, title: 'Whiplash', rating: 8.5 },
  { id: 3, title: 'Coco', rating: 8.4 },
]

function fetchMovies(shouldFail: boolean) {
  return new Promise<Movie[]>((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network request failed'))
        return
      }

      resolve(mockMovies)
    }, 700)
  })
}

export default function ApiCallsExample() {
  const [shouldFail, setShouldFail] = useState(false)
  const [requestState, setRequestState] = useState<RequestState>({
    status: 'loading',
  })

  useEffect(() => {
    let ignore = false

    setRequestState({ status: 'loading' })
    fetchMovies(shouldFail)
      .then((movies) => {
        if (ignore) return
        setRequestState(
          movies.length > 0 ? { status: 'success', data: movies } : { status: 'empty' },
        )
      })
      .catch((error: Error) => {
        if (ignore) return
        setRequestState({ status: 'error', message: error.message })
      })

    return () => {
      ignore = true
    }
  }, [shouldFail])

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setShouldFail((value) => !value)}>
        {shouldFail ? 'Retry success request' : 'Simulate failed request'}
      </button>

      {requestState.status === 'loading' && (
        <p className="status-box">Loading movies...</p>
      )}
      {requestState.status === 'empty' && <p className="status-box">No results.</p>}
      {requestState.status === 'error' && (
        <p className="status-box">{requestState.message}</p>
      )}
      {requestState.status === 'success' && (
        <ul className="demo-list">
          {requestState.data.map((movie) => (
            <li key={movie.id}>
              <span>{movie.title}</span>
              <strong>{movie.rating}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
