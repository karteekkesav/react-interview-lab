import { useRef, useState } from 'react'

export default function UseRefExample() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const renderCountRef = useRef(0)
  const [name, setName] = useState('')

  renderCountRef.current += 1

  function focusInput() {
    inputRef.current?.focus()
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Candidate name
        <input
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type a name"
        />
      </label>
      <button type="button" onClick={focusInput}>
        Focus input
      </button>
      <p className="status-box">
        <strong>Render count stored in ref:</strong> {renderCountRef.current}
      </p>
    </div>
  )
}
