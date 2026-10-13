import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <article className="demo-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action}
    </article>
  )
}

export default function ComponentApiDesignExample() {
  return (
    <EmptyState
      title="No interviews scheduled"
      description="Use explicit props for text and a ReactNode slot for optional action."
      action={<button type="button">Schedule</button>}
    />
  )
}
