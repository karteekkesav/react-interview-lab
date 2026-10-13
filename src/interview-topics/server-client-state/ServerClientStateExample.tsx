import { useState } from 'react'

export default function ServerClientStateExample() {
  const [selectedMovieId, setSelectedMovieId] = useState(1)
  const moviesFromServer = [
    { id: 1, title: 'Arrival' },
    { id: 2, title: 'Inception' },
  ]

  return (
    <div className="demo-stack">
      <p className="status-box">
        Server state: movie list. Client state: selected movie id {selectedMovieId}.
      </p>
      <div className="button-row">
        {moviesFromServer.map((movie) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => setSelectedMovieId(movie.id)}
          >
            {movie.title}
          </button>
        ))}
      </div>
    </div>
  )
}
