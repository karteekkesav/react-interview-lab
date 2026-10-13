import type { ReactNode } from 'react'

function InterviewPanel({
  title,
  actions,
  children,
}: {
  title: string
  actions: ReactNode
  children: ReactNode
}) {
  return (
    <section className="demo-card">
      <div>
        <h3>{title}</h3>
        {children}
      </div>
      <div className="button-row">{actions}</div>
    </section>
  )
}

export default function ChildrenCompositionExample() {
  return (
    <InterviewPanel
      title="Composition-friendly panel"
      actions={<button type="button">Start revision</button>}
    >
      <p>
        The parent decides the content while the panel owns layout and structure.
      </p>
    </InterviewPanel>
  )
}
