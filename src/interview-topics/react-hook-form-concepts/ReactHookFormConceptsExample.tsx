import { useRef, useState } from 'react'

type FormSnapshot = {
  name: string
  email: string
}

export default function ReactHookFormConceptsExample() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const [submitted, setSubmitted] = useState<FormSnapshot | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted({
      name: nameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
    })
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input ref={nameRef} name="name" placeholder="Candidate name" />
      </label>
      <label>
        Email
        <input ref={emailRef} name="email" placeholder="candidate@example.com" />
      </label>
      <button type="submit">Submit uncontrolled form</button>
      {submitted && (
        <p className="status-box">
          {submitted.name || 'Unknown'} - {submitted.email || 'No email'}
        </p>
      )}
    </form>
  )
}
