import { useMemo, useReducer } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
}

type State = {
  tasks: Task[]
}

type Action =
  | { type: 'toggle'; taskId: number }
  | { type: 'add'; title: string }
  | { type: 'clearCompleted' }

const initialState: State = {
  tasks: [
    { id: 1, title: 'Revise props vs state', done: true },
    { id: 2, title: 'Practice API loading states', done: false },
  ],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'toggle':
      return {
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, done: !task.done } : task,
        ),
      }
    case 'add':
      return {
        tasks: [
          ...state.tasks,
          { id: Date.now(), title: action.title, done: false },
        ],
      }
    case 'clearCompleted':
      return { tasks: state.tasks.filter((task) => !task.done) }
    default:
      return state
  }
}

export default function StateManagementExample() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const completedCount = useMemo(
    () => state.tasks.filter((task) => task.done).length,
    [state.tasks],
  )

  return (
    <div className="demo-stack">
      <p className="status-box">
        <strong>Completed:</strong> {completedCount} / {state.tasks.length}
      </p>
      <ul className="demo-list">
        {state.tasks.map((task) => (
          <li key={task.id}>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => dispatch({ type: 'toggle', taskId: task.id })}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
      <div className="button-row">
        <button
          type="button"
          onClick={() => dispatch({ type: 'add', title: 'Mock interview task' })}
        >
          Add task
        </button>
        <button type="button" onClick={() => dispatch({ type: 'clearCompleted' })}>
          Clear completed
        </button>
      </div>
    </div>
  )
}
