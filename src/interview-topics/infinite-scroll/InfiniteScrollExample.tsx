import { useMemo, useState } from 'react'

const allItems = Array.from({ length: 24 }, (_, index) => `Result ${index + 1}`)
const pageSize = 6

export default function InfiniteScrollExample() {
  const [page, setPage] = useState(1)
  const visibleItems = useMemo(
    () => allItems.slice(0, page * pageSize),
    [page],
  )
  const hasMore = visibleItems.length < allItems.length

  return (
    <div className="demo-stack">
      <ul className="demo-list">
        {visibleItems.map((item) => (
          <li key={item}>
            <span>{item}</span>
            <strong>Loaded</strong>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!hasMore}
        onClick={() => setPage((current) => current + 1)}
      >
        {hasMore ? 'Load more' : 'All results loaded'}
      </button>
    </div>
  )
}
