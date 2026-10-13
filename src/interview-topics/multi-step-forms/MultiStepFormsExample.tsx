import { useState } from 'react'

export default function MultiStepFormsExample() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [role, setRole] = useState('Frontend Developer')

  return (
    <div className="demo-stack">
      <p className="status-box">Step {step} of 3</p>
      {step === 1 && (
        <label className="field-row">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
      )}
      {step === 2 && (
        <label className="field-row">
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Frontend Developer</option>
            <option>React Developer</option>
          </select>
        </label>
      )}
      {step === 3 && (
        <p className="status-box">
          Review: {name || 'No name'} - {role}
        </p>
      )}
      <div className="button-row">
        <button type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>
          Back
        </button>
        <button type="button" disabled={step === 3} onClick={() => setStep(step + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
