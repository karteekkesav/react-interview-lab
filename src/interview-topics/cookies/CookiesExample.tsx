import { useState } from 'react'

export default function CookiesExample() {
  const [status, setStatus] = useState('No demo cookie set')

  function setCookie() {
    document.cookie = 'interview_lab=react; max-age=300; path=/; SameSite=Lax'
    setStatus('Cookie set for 5 minutes')
  }

  function readCookie() {
    setStatus(document.cookie || 'No readable cookies')
  }

  return (
    <div className="demo-stack">
      <div className="button-row">
        <button type="button" onClick={setCookie}>
          Set demo cookie
        </button>
        <button type="button" onClick={readCookie}>
          Read cookies
        </button>
      </div>
      <p className="status-box">{status}</p>
    </div>
  )
}
