const apiMode = import.meta.env.MODE
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'not configured'

export default function EnvironmentVariablesExample() {
  return (
    <div className="demo-stack">
      <p className="status-box">
        <strong>Mode:</strong> {apiMode}
        <br />
        <strong>VITE_API_BASE_URL:</strong> {apiBaseUrl}
      </p>
    </div>
  )
}
