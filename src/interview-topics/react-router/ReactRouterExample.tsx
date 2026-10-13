import { Link, Route, Routes, useParams } from 'react-router-dom'

const movies = [
  { id: 'inception', title: 'Inception', genre: 'Sci-Fi' },
  { id: 'arrival', title: 'Arrival', genre: 'Sci-Fi Drama' },
  { id: 'parasite', title: 'Parasite', genre: 'Thriller' },
]

function MovieDetails() {
  const { movieId } = useParams()
  const movie = movies.find((item) => item.id === movieId)

  if (!movie) {
    return <p className="status-box">Movie route param did not match data.</p>
  }

  return (
    <article className="demo-card">
      <div>
        <h3>{movie.title}</h3>
        <p>Genre: {movie.genre}</p>
      </div>
    </article>
  )
}

export default function ReactRouterExample() {
  return (
    <div className="demo-stack">
      <div className="button-row">
        {movies.map((movie) => (
          <Link className="demo-link" key={movie.id} to={movie.id}>
            {movie.title}
          </Link>
        ))}
      </div>

      <Routes>
        <Route index element={<p className="status-box">Choose a movie.</p>} />
        <Route path=":movieId" element={<MovieDetails />} />
      </Routes>
    </div>
  )
}
