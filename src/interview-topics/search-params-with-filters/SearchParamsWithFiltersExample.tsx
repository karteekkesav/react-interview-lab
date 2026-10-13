import { useSearchParams } from 'react-router-dom'

const jobs = [
  { id: 1, title: 'React Developer', type: 'frontend' },
  { id: 2, title: 'Node Developer', type: 'backend' },
  { id: 3, title: 'Full Stack Developer', type: 'fullstack' },
]

export default function SearchParamsWithFiltersExample() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') || 'all'
  const visibleJobs = type === 'all' ? jobs : jobs.filter((job) => job.type === type)

  return (
    <div className="demo-stack">
      <div className="segmented-control">
        {['all', 'frontend', 'backend', 'fullstack'].map((item) => (
          <button
            key={item}
            type="button"
            className={type === item ? 'selected' : ''}
            onClick={() => setParams(item === 'all' ? {} : { type: item })}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="demo-list">
        {visibleJobs.map((job) => (
          <li key={job.id}>
            <span>{job.title}</span>
            <strong>{job.type}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
