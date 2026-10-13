import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, NavLink, Route, Routes, useParams } from 'react-router-dom'
import { isAuth0Configured } from './auth/Auth0ProviderWithConfig'
import './App.css'
import { topics } from './interview-topics/topics'
import TailwindLab from './tailwind-lab/TailwindLab'

function TopicPage() {
  const { topicId } = useParams()
  const topic = topics.find((item) => item.id === topicId)

  if (!topic) {
    return <Navigate to={`/${topics[0].id}`} replace />
  }

  const Example = topic.Example

  return (
    <main className="topic-page">
      <section className="topic-intro">
        <p className="eyebrow">{topic.group}</p>
        <h1>{topic.title}</h1>
        <p>{topic.summary}</p>
      </section>

      <section className="example-panel" aria-labelledby="example-title">
        <div className="section-heading">
          <p className="eyebrow">Runnable example</p>
          <h2 id="example-title">{topic.title} Example</h2>
        </div>
        <Example />
      </section>

      <section className="notes-panel" aria-labelledby="notes-title">
        <div className="section-heading">
          <p className="eyebrow">Interview notes</p>
          <h2 id="notes-title">{topic.title} Explanation</h2>
        </div>
        <article className="markdown-notes">
          <pre>{topic.notes}</pre>
        </article>
      </section>
    </main>
  )
}

function AuthSetupScreen() {
  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="eyebrow">Auth0 setup</p>
        <h1>Connect Auth0 to unlock the interview lab</h1>
        <p>
          Add your Auth0 domain and client ID to `.env` or `.env.local`, then
          restart the Vite dev server.
        </p>
        <div className="status-box">
          <span>Required variables</span>
          <strong>VITE_AUTH0_DOMAIN + VITE_AUTH0_CLIENT_ID</strong>
        </div>
      </section>
    </main>
  )
}

function LoginScreen() {
  const { error, isLoading, loginWithRedirect } = useAuth0()

  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="eyebrow">React Interview Lab</p>
        <h1>Login to view all React topics</h1>
        <p>
          Use Auth0 authentication to access the protected learning dashboard,
          examples, and interview notes.
        </p>

        {error ? <p className="field-error">{error.message}</p> : null}

        <button
          type="button"
          onClick={() => loginWithRedirect()}
          disabled={isLoading}
        >
          {isLoading ? 'Checking session...' : 'Login with Auth0'}
        </button>
      </section>
    </main>
  )
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading, logout, user } = useAuth0()

  if (isLoading) {
    return (
      <main className="login-page">
        <section className="login-panel">
          <p className="eyebrow">Auth0</p>
          <h1>Checking your session</h1>
          <p>Please wait while Auth0 restores your login state.</p>
        </section>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">R</span>
          <div>
            <strong>React Interview Lab</strong>
            <span>Learn, run, revise</span>
          </div>
        </div>

        <div className="auth-summary">
          <span>{user?.name ?? 'Authenticated user'}</span>
          <small>{user?.email ?? 'Auth0 session active'}</small>
          <button
            type="button"
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
          >
            Logout
          </button>
        </div>

        <nav className="topic-nav" aria-label="Interview topics">
          <NavLink
            to="/tailwind-lab"
            className={({ isActive }) =>
              isActive ? 'topic-link active' : 'topic-link'
            }
          >
            <span>Tailwind CSS Lab</span>
            <small>UI styling</small>
          </NavLink>

          {topics.map((topic) => (
            <NavLink
              key={topic.id}
              to={`/${topic.id}`}
              className={({ isActive }) =>
                isActive ? 'topic-link active' : 'topic-link'
              }
            >
              <span>{topic.title}</span>
              <small>{topic.group}</small>
            </NavLink>
          ))}
        </nav>
      </aside>

      <Routes>
        <Route path="/" element={<Navigate to={`/${topics[0].id}`} replace />} />
        <Route path="/tailwind-lab" element={<TailwindLab />} />
        <Route path="/:topicId/*" element={<TopicPage />} />
      </Routes>
    </div>
  )
}

function App() {
  if (!isAuth0Configured) {
    return <AuthSetupScreen />
  }

  return <AuthenticatedApp />
}

export default App
