import { useState } from 'react'

type Filter = 'all' | 'watched' | 'unwatched'

const movies = [
  { id: 1, title: 'Interstellar', watched: true },
  { id: 2, title: 'The Social Network', watched: false },
  { id: 3, title: 'Dune', watched: true },
]

export default function StateExample() {
  const [filter, setFilter] = useState<Filter>('all')

  const visibleMovies = movies.filter((movie) => {
    if (filter === 'watched') return movie.watched
    if (filter === 'unwatched') return !movie.watched
    return true
  })

  return (
    <div className="demo-stack">
      <div className="segmented-control" aria-label="Movie filter">
        {(['all', 'watched', 'unwatched'] as Filter[]).map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? 'selected' : ''}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="demo-list">
        {visibleMovies.map((movie) => (
          <li key={movie.id}>
            <span>{movie.title}</span>
            <strong>{movie.watched ? 'Watched' : 'Pending'}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
