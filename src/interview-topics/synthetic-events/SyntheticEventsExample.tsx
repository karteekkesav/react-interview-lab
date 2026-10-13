import { useState } from 'react'

export default function SyntheticEventsExample() {
  const [eventSummary, setEventSummary] = useState('No event captured yet')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEventSummary(`type=${event.type}, value=${event.target.value}`)
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Type to inspect event
        <input onChange={handleChange} placeholder="React event demo" />
      </label>
      <p className="status-box">{eventSummary}</p>
    </div>
  )
}
