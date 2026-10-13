import { useId } from 'react'

export default function UseIdExample() {
  const emailId = useId()
  const hintId = useId()

  return (
    <form className="demo-form">
      <label htmlFor={emailId}>Email</label>
      <input id={emailId} aria-describedby={hintId} placeholder="you@example.com" />
      <span id={hintId}>useId connects labels and descriptions safely.</span>
    </form>
  )
}
