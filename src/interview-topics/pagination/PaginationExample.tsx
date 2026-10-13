import { useMemo, useState } from 'react'

const questions = Array.from({ length: 13 }, (_, index) => ({
  id: index + 1,
  title: `Interview question ${index + 1}`,
}))

const pageSize = 5

export default function PaginationExample() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(questions.length / pageSize)

  const visibleQuestions = useMemo(() => {
    const start = (page - 1) * pageSize
    return questions.slice(start, start + pageSize)
  }, [page])

  return (
    <div className="demo-stack">
      <ul className="demo-list">
        {visibleQuestions.map((question) => (
          <li key={question.id}>
            <span>{question.title}</span>
            <strong>#{question.id}</strong>
          </li>
        ))}
      </ul>
      <div className="button-row">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>
        <p className="status-box">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
