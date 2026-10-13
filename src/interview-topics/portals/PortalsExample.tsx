import { useState } from 'react'
import { createPortal } from 'react-dom'

function Modal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" role="dialog" aria-modal="true">
        <h3>Portal modal</h3>
        <p>This modal is rendered into document.body, outside the normal parent DOM.</p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </section>
    </div>,
    document.body,
  )
}

export default function PortalsExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      <p className="status-box">Portals are common for modals, popovers, and tooltips.</p>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </div>
  )
}
