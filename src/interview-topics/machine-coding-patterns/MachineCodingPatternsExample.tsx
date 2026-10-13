import { useMemo, useState } from 'react'

type Product = {
  id: number
  name: string
  category: 'All' | 'Frontend' | 'Backend'
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const questions: Product[] = [
  { id: 1, name: 'Build tabs', category: 'Frontend', difficulty: 'Easy' },
  { id: 2, name: 'Debounced search', category: 'Frontend', difficulty: 'Medium' },
  { id: 3, name: 'Rate limiter', category: 'Backend', difficulty: 'Hard' },
  { id: 4, name: 'Paginated table', category: 'Frontend', difficulty: 'Medium' },
]

export default function MachineCodingPatternsExample() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Product['category']>('All')

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesQuery = question.name.toLowerCase().includes(query.toLowerCase())
      const matchesCategory =
        category === 'All' || question.category === category

      return matchesQuery && matchesCategory
    })
  }, [category, query])

  return (
    <div className="demo-stack">
      <label className="field-row">
        Search machine coding task
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="segmented-control" aria-label="Category filter">
        {(['All', 'Frontend', 'Backend'] as Product['category'][]).map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? 'selected' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="status-box">
        <strong>Matching tasks:</strong> {filteredQuestions.length}
      </p>
      <ul className="demo-list">
        {filteredQuestions.map((question) => (
          <li key={question.id}>
            <span>{question.name}</span>
            <strong>{question.difficulty}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
