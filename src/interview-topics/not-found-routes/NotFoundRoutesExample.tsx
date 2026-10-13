import { Link, Route, Routes } from 'react-router-dom'

export default function NotFoundRoutesExample() {
  return (
    <div className="demo-stack">
      <div className="button-row">
        <Link className="demo-link" to="known">
          Known route
        </Link>
        <Link className="demo-link" to="missing">
          Missing route
        </Link>
      </div>
      <Routes>
        <Route index element={<p className="status-box">Pick a route.</p>} />
        <Route path="known" element={<p className="status-box">Known route matched.</p>} />
        <Route path="*" element={<p className="status-box">404: route not found.</p>} />
      </Routes>
    </div>
  )
}
