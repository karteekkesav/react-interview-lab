import { useState } from 'react'

type ValidationResult = {
  email?: string
  password?: string
}

function validate(values: { email: string; password: string }) {
  const errors: ValidationResult = {}
  if (!values.email.includes('@')) errors.email = 'Email must contain @.'
  if (values.password.length < 8) errors.password = 'Password needs 8 characters.'
  return errors
}

export default function SchemaValidationExample() {
  const [errors, setErrors] = useState<ValidationResult>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setErrors(
      validate({
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      }),
    )
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>
      <label>
        Password
        <input name="password" type="password" />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </label>
      <button type="submit">Validate</button>
    </form>
  )
}
