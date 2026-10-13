import { useState } from 'react'

export default function AccessibilityExample() {
  const [message, setMessage] = useState('')

  return (
    <form
      className="demo-form"
      onSubmit={(event) => {
        event.preventDefault()
        setMessage('Form submitted accessibly.')
      }}
    >
      <label htmlFor="accessible-name">Full name</label>
      <input id="accessible-name" required />
      <button type="submit">Submit</button>
      <p className="status-box" role="status" aria-live="polite">
        {message || 'Status messages will be announced here.'}
      </p>
    </form>
  )
}
