import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

function Modal({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" role="dialog" aria-modal="true">
        <h3>{title}</h3>
        {children}
        <button type="button" onClick={onClose}>
          Close
        </button>
      </section>
    </div>,
    document.body,
  )
}

export default function ReusableModalPatternExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setIsOpen(true)}>
        Open reusable modal
      </button>
      <Modal
        title="Reusable Modal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <p>The caller controls open state and supplies modal content.</p>
      </Modal>
    </div>
  )
}
