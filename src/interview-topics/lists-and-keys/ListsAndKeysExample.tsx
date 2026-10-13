import { useState } from 'react'

type Task = {
  id: string
  label: string
  priority: 'High' | 'Medium' | 'Low'
}

const initialTasks: Task[] = [
  { id: 'api', label: 'Explain API loading states', priority: 'High' },
  { id: 'keys', label: 'Avoid index keys in dynamic lists', priority: 'High' },
  { id: 'memo', label: 'Revise memoization use cases', priority: 'Medium' },
]

export default function ListsAndKeysExample() {
  const [tasks, setTasks] = useState(initialTasks)

  function moveFirstToEnd() {
    setTasks(([first, ...rest]) => [...rest, first])
  }

  return (
    <div className="demo-stack">
      <button type="button" onClick={moveFirstToEnd}>
        Move first task to end
      </button>
      <ul className="demo-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.label}</span>
            <strong>{task.priority}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
