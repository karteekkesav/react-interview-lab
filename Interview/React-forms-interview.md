# React Forms Interview Notes

Purpose: quick interview revision with simple JavaScript examples.

## Controlled Components

A controlled component is a form element whose value is controlled by React state.

```jsx
import { useState } from "react"

function ControlledInputExample() {
  const [name, setName] = useState("")

  return (
    <div>
      <label>
        Name:
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <p>Typed name: {name}</p>
    </div>
  )
}
```

Flow:

```text
User types
  |
  v
onChange updates React state
  |
  v
component re-renders
  |
  v
input value comes from state
```

Interview answer:

Controlled components are useful when we need validation, formatting, conditional UI, or predictable form submission.

## Form Implementation Step-By-Step

Use this flow when the interviewer asks, "How do you build a form in React?"

```text
1. Decide controlled or uncontrolled
   |
   v
2. Create state for controlled fields
   |
   v
3. Update state on onChange
   |
   v
4. Validate values
   |
   v
5. Disable submit if invalid or loading
   |
   v
6. Submit data to API
   |
   v
7. Show success or error message
```

Simple controlled form:

```jsx
import { useState } from "react"

function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      console.log("Login success")
    } catch {
      setError("Unable to login. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" value={form.email} onChange={handleChange} />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
```

Interview answer:

For most business forms, I use controlled inputs because validation, disabled buttons, error messages, and API submission become easier to manage. For file inputs, I usually treat them as uncontrolled and read files from the input event or ref.

## Controlled Form With Validation

```jsx
import { useState } from "react"

function EmailForm() {
  const [email, setEmail] = useState("")
  const isValidEmail = email.includes("@")

  return (
    <form>
      <label>
        Email:
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      {!isValidEmail && email.length > 0 && (
        <p role="alert">Please enter a valid email</p>
      )}

      <button disabled={!isValidEmail}>Submit</button>
    </form>
  )
}
```

Interview point:

`role="alert"` helps screen readers announce validation errors and gives tests a meaningful way to find the error message.

## Uncontrolled Components

An uncontrolled component stores its value in the DOM. React reads it when needed through a ref.

```jsx
import { useRef } from "react"

function UncontrolledInputExample() {
  const nameRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    console.log("Name:", nameRef.current.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input ref={nameRef} defaultValue="Karteek" />
      </label>

      <button type="submit">Submit</button>
    </form>
  )
}
```

Interview answer:

Uncontrolled components are useful for simple forms, file inputs, and integrations where the DOM owns the value.

## Controlled Vs Uncontrolled

```text
Controlled
  |
  +-- React state owns value
  +-- value + onChange
  +-- good for validation and live UI

Uncontrolled
  |
  +-- DOM owns value
  +-- ref + defaultValue
  +-- good for simple forms and file inputs
```

Interview answer:

I use controlled inputs when I need validation or conditional UI. I use uncontrolled inputs when I only need the value on submit or when working with file inputs.

### Which Approach For A Large Form?

Mental model:

```text
Controlled:   React state is the source of truth on every change
Uncontrolled: The DOM holds the current value; React reads it when needed
```

Controlled fields make live behavior straightforward:

```jsx
function ShippingForm() {
  const [country, setCountry] = useState("IN")

  return (
    <>
      <select value={country} onChange={(event) => setCountry(event.target.value)}>
        <option value="IN">India</option>
        <option value="US">United States</option>
      </select>

      {country === "US" && <StateSelector />}
    </>
  )
}
```

This is useful for dependent fields, instant validation, formatting, character counts, and disabling submit based on current values. The tradeoff is that each change updates React state and can re-render the component containing the form.

Uncontrolled fields avoid storing every keystroke in component state:

```jsx
function ContactForm() {
  const formRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(formRef.current))
    console.log(values)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="firstName" defaultValue="" />
      <input name="lastName" defaultValue="" />
      <button type="submit">Save</button>
    </form>
  )
}
```

For a large form, I usually choose a hybrid approach or a form library such as React Hook Form, which commonly registers inputs without making the entire form controlled. I keep fields controlled where the UI must react immediately and leave simple fields uncontrolled. File inputs remain uncontrolled.

Real-time scenario: a 60-field onboarding form may contain mostly ordinary text fields plus a few dependent fields. Registering ordinary fields as uncontrolled limits broad re-renders, while controlling country, account type, and consent fields makes conditional sections predictable.

The decision is about behavior and measured performance, not form size alone. Splitting a controlled form into field components can also isolate renders effectively.

Interview answer:

For a large form, I do not automatically put every keystroke in one parent state object. I usually use React Hook Form or a hybrid design, keep simple inputs uncontrolled, and control fields that drive validation or conditional UI. This gives predictable behavior without re-rendering the whole form for every change.

## File Upload Input

File inputs are commonly uncontrolled because browsers restrict programmatic control for security.

```jsx
import { useRef } from "react"

function FileUploadExample() {
  const fileRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()

    const file = fileRef.current.files[0]
    console.log("Selected file:", file)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} />
      <button type="submit">Upload</button>
    </form>
  )
}
```

Interview answer:

For file inputs, React does not control the file value. We read selected files through `ref.current.files` or `event.target.files`.

## POI/POA Document Upload Example

This connects directly to Stablehouse onboarding.

```jsx
import { useState } from "react"

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  function handleFileChange(event) {
    const file = event.target.files[0]

    if (!file) return

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"]
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, PNG, or JPG files are allowed")
      return
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB")
      return
    }

    setError("")
    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append("document", selectedFile)
    formData.append("documentType", "POI")

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      console.log("Upload successful")
    } catch {
      setError("Unable to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />

      {selectedFile && <p>Selected: {selectedFile.name}</p>}
      {error && <p role="alert">{error}</p>}

      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Document"}
      </button>
    </div>
  )
}
```

Frontend responsibilities:

- file type validation
- file size validation
- selected file name or preview
- loading state
- error state
- retry
- upload progress
- disable button while uploading
- accessible error messages

Backend responsibilities:

- validate file type again
- validate file size again
- authenticate user
- authorize upload
- virus scanning
- secure storage

Resume answer:

In Stablehouse onboarding, POI and POA upload flows should validate file type and size, show selected file details, manage loading/error states, and submit document data to backend APIs. Backend validation and secure storage are essential for sensitive identity documents.

## Upload Approaches

### REST With FormData

```jsx
const formData = new FormData()
formData.append("document", file)
formData.append("documentType", "POI")

fetch("/api/documents/upload", {
  method: "POST",
  body: formData,
})
```

### GraphQL Multipart Upload

```text
React selects file
  |
  v
GraphQL mutation receives file
  |
  v
Backend stores document
  |
  v
Returns document ID or upload status
```

### Pre-Signed URL Upload

```text
React asks backend for signed URL
  |
  v
Backend returns S3/Azure signed URL
  |
  v
React uploads file directly to storage
  |
  v
React tells backend upload is complete
```

Interview answer:

For small uploads, REST with `FormData` is simple. For GraphQL apps, multipart upload may be used. For larger or sensitive files, pre-signed URLs are common because files upload directly to cloud storage.

## Form Validation Approaches

Validation can happen:

- on change
- on blur
- on submit
- with schema libraries like Zod or Yup

Simple submit validation:

```jsx
function LoginForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event) {
    event.preventDefault()

    if (!email.includes("@")) {
      setError("Enter a valid email")
      return
    }

    setError("")
    console.log("Submit:", email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(event) => setEmail(event.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

Interview answer:

Frontend validation improves user experience, but backend validation is always required for security.

## Large Forms

For large forms:

- split into sections
- use field-level validation
- avoid unnecessary re-renders
- use React Hook Form when suitable
- persist draft if needed
- show clear step-level errors

Interview answer:

For large forms, I prefer a structured approach with reusable fields, schema validation, and a form library like React Hook Form if performance and scalability matter.

## React Hook Form Vs Formik

```text
React Hook Form
  |
  +-- uncontrolled-first
  +-- fewer re-renders
  +-- good performance
  +-- common in modern React

Formik
  |
  +-- controlled-state style
  +-- mature
  +-- common in older projects
  +-- can re-render more in large forms
```

Interview answer:

I usually prefer React Hook Form for modern large forms because it is lightweight and performant. Formik is still valid, especially in older codebases.

## Multi-Step Forms

Example flow:

```text
Step 1: Personal Details
Step 2: POI Upload
Step 3: POA Upload
Step 4: Review
Step 5: Submit
```

Interview answer:

For multi-step forms, I keep step state clear, validate before moving to the next step, preserve draft data, and handle final submission with loading/error states.

## Quick Interview Summary

- Controlled forms use React state.
- Uncontrolled forms use DOM/ref.
- File inputs are usually uncontrolled.
- POI/POA uploads need validation, loading, error, retry, and secure backend handling.
- React Hook Form is often better for large modern forms.
- Backend validation is mandatory.
