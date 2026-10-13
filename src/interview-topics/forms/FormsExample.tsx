import { useState } from 'react'

type FormState = {
  name: string
  email: string
  role: string
}

export default function FormsExample() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    role: 'Frontend Developer',
  })
  const [submitted, setSubmitted] = useState<FormState | null>(null)

  const isValid = form.name.trim().length >= 2 && form.email.includes('@')

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) return
    setSubmitted(form)
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Ada Lovelace"
        />
      </label>
      <label>
        Email
        <input
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="ada@example.com"
        />
      </label>
      <label>
        Role
        <select
          value={form.role}
          onChange={(event) => updateField('role', event.target.value)}
        >
          <option>Frontend Developer</option>
          <option>React Developer</option>
          <option>Full Stack Developer</option>
        </select>
      </label>
      <button type="submit" disabled={!isValid}>
        Submit profile
      </button>
      {submitted && (
        <p className="success-message">
          Submitted {submitted.name} for {submitted.role}.
        </p>
      )}
    </form>
  )
}
