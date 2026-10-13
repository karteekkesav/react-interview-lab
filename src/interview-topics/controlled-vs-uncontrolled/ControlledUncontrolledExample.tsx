import { useRef, useState } from 'react'

export default function ControlledUncontrolledExample() {
  const [controlledValue, setControlledValue] = useState('')
  const uncontrolledRef = useRef<HTMLInputElement | null>(null)
  const [submittedValue, setSubmittedValue] = useState('Nothing submitted yet')

  function readUncontrolledValue() {
    setSubmittedValue(uncontrolledRef.current?.value || 'Empty uncontrolled input')
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Controlled input
        <input
          value={controlledValue}
          onChange={(event) => setControlledValue(event.target.value)}
          placeholder="React owns this value"
        />
      </label>
      <label className="field-row">
        Uncontrolled input
        <input ref={uncontrolledRef} placeholder="DOM owns this value" />
      </label>
      <button type="button" onClick={readUncontrolledValue}>
        Read uncontrolled value
      </button>
      <p className="status-box">
        <strong>Controlled:</strong> {controlledValue || 'Empty'}
        <br />
        <strong>Uncontrolled submitted:</strong> {submittedValue}
      </p>
    </div>
  )
}
