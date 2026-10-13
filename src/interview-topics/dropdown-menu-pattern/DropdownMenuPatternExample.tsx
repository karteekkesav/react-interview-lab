import { useState } from 'react'

export default function DropdownMenuPatternExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [lastAction, setLastAction] = useState('No action yet')

  function chooseAction(action: string) {
    setLastAction(action)
    setIsOpen(false)
  }

  return (
    <div className="dropdown-demo">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        Actions
      </button>
      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => chooseAction('Edit')}>
            Edit
          </button>
          <button type="button" role="menuitem" onClick={() => chooseAction('Archive')}>
            Archive
          </button>
        </div>
      )}
      <p className="status-box">{lastAction}</p>
    </div>
  )
}
