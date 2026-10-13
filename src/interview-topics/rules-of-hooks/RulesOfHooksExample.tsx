import { useState } from 'react'

function useInterviewProgress(initialTopic: string) {
  const [completedTopics, setCompletedTopics] = useState<string[]>([initialTopic])

  function markComplete(topic: string) {
    setCompletedTopics((current) =>
      current.includes(topic) ? current : [...current, topic],
    )
  }

  return { completedTopics, markComplete }
}

export default function RulesOfHooksExample() {
  const { completedTopics, markComplete } = useInterviewProgress('Props')

  return (
    <div className="demo-stack">
      <p className="status-box">
        Hooks are called at the top level before any conditional return.
      </p>
      <button type="button" onClick={() => markComplete('Rules of Hooks')}>
        Mark Rules of Hooks complete
      </button>
      <ul className="demo-list">
        {completedTopics.map((topic) => (
          <li key={topic}>
            <span>{topic}</span>
            <strong>Done</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
