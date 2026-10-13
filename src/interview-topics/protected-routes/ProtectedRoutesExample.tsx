import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'

function ProtectedScreen({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="login" replace />
  }

  return <p className="status-box">Private dashboard content is visible.</p>
}

export default function ProtectedRoutesExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="demo-stack">
      <button type="button" onClick={() => setIsAuthenticated((value) => !value)}>
        {isAuthenticated ? 'Log out' : 'Log in'}
      </button>
      <Routes>
        <Route
          index
          element={<ProtectedScreen isAuthenticated={isAuthenticated} />}
        />
        <Route path="login" element={<p className="status-box">Login screen</p>} />
      </Routes>
    </div>
  )
}
