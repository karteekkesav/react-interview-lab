import { useSearchParams } from 'react-router-dom'

const topics = ['props', 'state', 'effects', 'router']

export default function UrlStateSearchParamsExample() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTopic = searchParams.get('topic') || 'props'

  return (
    <div className="demo-stack">
      <div className="segmented-control">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className={selectedTopic === topic ? 'selected' : ''}
            onClick={() => setSearchParams({ topic })}
          >
            {topic}
          </button>
        ))}
      </div>
      <p className="status-box">
        Shareable URL state: <strong>{selectedTopic}</strong>
      </p>
    </div>
  )
}
