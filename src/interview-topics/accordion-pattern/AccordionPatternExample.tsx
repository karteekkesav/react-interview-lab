import { useState } from 'react'

const items = [
  { id: 'props', title: 'What are props?', body: 'Read-only inputs from parent to child.' },
  { id: 'state', title: 'What is state?', body: 'Component-owned data that changes.' },
]

export default function AccordionPatternExample() {
  const [openId, setOpenId] = useState<string | null>('props')

  return (
    <div className="demo-stack">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <section className="demo-card" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              {isOpen && <p>{item.body}</p>}
            </div>
            <button type="button" onClick={() => setOpenId(isOpen ? null : item.id)}>
              {isOpen ? 'Close' : 'Open'}
            </button>
          </section>
        )
      })}
    </div>
  )
}
