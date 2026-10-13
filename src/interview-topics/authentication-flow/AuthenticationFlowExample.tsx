import { useState } from 'react'

type AuthState =
  | { status: 'guest' }
  | { status: 'loading' }
  | { status: 'authenticated'; user: string }

export default function AuthenticationFlowExample() {
  const [authState, setAuthState] = useState<AuthState>({ status: 'guest' })

  function logIn() {
    setAuthState({ status: 'loading' })
    window.setTimeout(() => {
      setAuthState({ status: 'authenticated', user: 'React Learner' })
    }, 700)
  }

  function logOut() {
    setAuthState({ status: 'guest' })
  }

  return (
    <div className="demo-stack">
      {authState.status === 'guest' && (
        <>
          <p className="status-box">Guest session. Please log in.</p>
          <button type="button" onClick={logIn}>
            Log in
          </button>
        </>
      )}
      {authState.status === 'loading' && (
        <p className="status-box">Checking session...</p>
      )}
      {authState.status === 'authenticated' && (
        <>
          <p className="status-box">Welcome, {authState.user}.</p>
          <button type="button" onClick={logOut}>
            Log out
          </button>
        </>
      )}
    </div>
  )
}
