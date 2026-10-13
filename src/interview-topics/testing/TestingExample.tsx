import { useState } from 'react'

export default function TestingExample() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = email.includes('@')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(canSubmit ? 'Invite sent' : 'Enter a valid email')
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <label>
        Candidate email
        <input
          aria-label="Candidate email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="candidate@example.com"
        />
      </label>
      <button type="submit" disabled={!canSubmit}>
        Send invite
      </button>
      {message && <p className="status-box">{message}</p>}
    </form>
  )
}
