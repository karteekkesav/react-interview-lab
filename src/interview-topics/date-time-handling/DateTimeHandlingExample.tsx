const interviewDate = new Date('2026-07-15T09:30:00Z')

export default function DateTimeHandlingExample() {
  const localTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(interviewDate)

  const utcTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(interviewDate)

  return (
    <div className="demo-stack">
      <p className="status-box">
        <strong>Local:</strong> {localTime}
        <br />
        <strong>UTC:</strong> {utcTime}
      </p>
    </div>
  )
}
