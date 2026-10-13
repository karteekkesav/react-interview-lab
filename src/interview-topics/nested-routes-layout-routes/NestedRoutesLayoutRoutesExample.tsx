import { Link, Outlet, Route, Routes } from 'react-router-dom'

function SettingsLayout() {
  return (
    <div className="demo-stack">
      <div className="button-row">
        <Link className="demo-link" to="profile">
          Profile
        </Link>
        <Link className="demo-link" to="security">
          Security
        </Link>
      </div>
      <Outlet />
    </div>
  )
}

export default function NestedRoutesLayoutRoutesExample() {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route index element={<p className="status-box">Choose a settings page.</p>} />
        <Route path="profile" element={<p className="status-box">Profile settings</p>} />
        <Route path="security" element={<p className="status-box">Security settings</p>} />
      </Route>
    </Routes>
  )
}
