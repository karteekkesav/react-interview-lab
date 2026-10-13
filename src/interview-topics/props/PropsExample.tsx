type Movie = {
  id: number
  title: string
  year: number
  rating: number
  isWatched: boolean
}

type MovieCardProps = {
  movie: Movie
  onToggleWatched: (movieId: number) => void
}

function MovieCard({ movie, onToggleWatched }: MovieCardProps) {
  return (
    <article className="demo-card">
      <div>
        <h3>{movie.title}</h3>
        <p>
          {movie.year} - IMDb {movie.rating}
        </p>
      </div>
      <button type="button" onClick={() => onToggleWatched(movie.id)}>
        {movie.isWatched ? 'Watched' : 'Mark watched'}
      </button>
    </article>
  )
}

export default function PropsExample() {
  const movies: Movie[] = [
    { id: 1, title: 'Inception', year: 2010, rating: 8.8, isWatched: true },
    { id: 2, title: 'Arrival', year: 2016, rating: 7.9, isWatched: false },
  ]

  function handleToggleWatched(movieId: number) {
    window.alert(`In a real app, update movie id ${movieId} in parent state.`)
  }

  return (
    <div className="demo-stack">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleWatched={handleToggleWatched}
        />
      ))}
    </div>
  )
}
