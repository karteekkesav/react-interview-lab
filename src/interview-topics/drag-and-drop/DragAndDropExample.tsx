import { useState } from 'react'

const initialTasks = [
  { id: 'props', title: 'Revise props' },
  { id: 'effects', title: 'Practice useEffect' },
  { id: 'router', title: 'Build route examples' },
]

export default function DragAndDropExample() {
  const [tasks, setTasks] = useState(initialTasks)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  function moveTask(targetId: string) {
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = tasks.findIndex((task) => task.id === draggedId)
    const targetIndex = tasks.findIndex((task) => task.id === targetId)
    const nextTasks = [...tasks]
    const [draggedTask] = nextTasks.splice(draggedIndex, 1)
    nextTasks.splice(targetIndex, 0, draggedTask)
    setTasks(nextTasks)
  }

  return (
    <ul className="demo-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          draggable
          onDragStart={() => setDraggedId(task.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => moveTask(task.id)}
          onDragEnd={() => setDraggedId(null)}
        >
          <span>{task.title}</span>
          <strong>{draggedId === task.id ? 'Dragging' : 'Drag'}</strong>
        </li>
      ))}
    </ul>
  )
}
