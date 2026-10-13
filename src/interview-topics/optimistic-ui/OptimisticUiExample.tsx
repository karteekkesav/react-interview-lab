import { useState } from 'react'

type Comment = {
  id: number
  text: string
  status: 'saved' | 'saving' | 'failed'
}

export default function OptimisticUiExample() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, text: 'Revise useEffect cleanup.', status: 'saved' },
  ])

  function addOptimisticComment(shouldFail: boolean) {
    const optimisticComment: Comment = {
      id: Date.now(),
      text: shouldFail ? 'This will rollback.' : 'Optimistic comment.',
      status: 'saving',
    }

    setComments((current) => [optimisticComment, ...current])

    window.setTimeout(() => {
      setComments((current) =>
        shouldFail
          ? current.filter((comment) => comment.id !== optimisticComment.id)
          : current.map((comment) =>
              comment.id === optimisticComment.id
                ? { ...comment, status: 'saved' }
                : comment,
            ),
      )
    }, 800)
  }

  return (
    <div className="demo-stack">
      <div className="button-row">
        <button type="button" onClick={() => addOptimisticComment(false)}>
          Add successful comment
        </button>
        <button type="button" onClick={() => addOptimisticComment(true)}>
          Add failed comment
        </button>
      </div>
      <ul className="demo-list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <span>{comment.text}</span>
            <strong>{comment.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
