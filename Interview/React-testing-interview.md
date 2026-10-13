# React Testing Interview Notes: Jest And React Testing Library

## What Is React Testing?

React testing means verifying that components behave correctly for users.

In interviews, the most important point is:

```text
Test behavior, not implementation details.
```

Good tests check what the user can see and do:

- text visible on screen
- button click behavior
- form validation
- loading state
- error state
- API success state
- API failure state
- navigation or callback behavior

Avoid testing internal details like:

- private component variables
- exact state names
- implementation-specific function calls
- CSS class names unless they are part of the requirement

## Jest Vs React Testing Library

Jest and React Testing Library are commonly used together, but they do different jobs.

```text
Jest
  |
  +-- test runner
  +-- assertions
  +-- mocks
  +-- spies
  +-- code coverage

React Testing Library
  |
  +-- renders React components
  +-- queries DOM like a user
  +-- fires user interactions
  +-- encourages accessible tests
```

Interview answer:

Jest runs the tests and provides assertions/mocking. React Testing Library renders components and lets us interact with the UI the way a user would.

## Testing Setup Steps

Use this flow when the interviewer asks, "How do you set up testing in a React project?"

```text
1. Install test libraries
   |
   v
2. Add test setup file
   |
   v
3. Configure jest-dom matchers
   |
   v
4. Write component tests with RTL
   |
   v
5. Mock APIs with MSW or controlled mocks
```

Typical packages:

```text
@testing-library/react
@testing-library/user-event
@testing-library/jest-dom
jest or vitest
jsdom
```

Test setup file:

```js
import "@testing-library/jest-dom"
```

Example script:

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

Interview answer:

In a Vite React app, I usually use Vitest with React Testing Library and `jest-dom`. I configure a setup file for matchers like `toBeInTheDocument`, then write tests around user-visible behavior.

## Basic Jest Test

Jest can test normal JavaScript functions.

```js
function add(a, b) {
  return a + b
}

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5)
})
```

Common Jest APIs:

```text
test / it      -> define a test case
describe       -> group tests
expect         -> assertion
jest.fn()      -> mock function
jest.mock()    -> mock module
beforeEach     -> setup before each test
afterEach      -> cleanup after each test
```

## Assertion, expect, And Matchers

An assertion means checking whether the actual result matches the expected result.

Simple structure:

```js
expect(actualValue).toBe(expectedValue)
```

Example:

```js
test("adds two numbers", () => {
  const result = 2 + 3

  expect(result).toBe(5)
})
```

Explanation:

```text
result
  |
  +-- actual value

5
  |
  +-- expected value

expect(result).toBe(5)
  |
  +-- assertion
```

In this example, `toBe(5)` is called a matcher. A matcher is the function that defines what condition should be true.

Common matchers:

```js
expect(result).toBe(5)
expect(name).toEqual("Karteek")
expect(items).toHaveLength(3)
expect(button).toBeDisabled()
expect(message).toBeInTheDocument()
```

Interview answer:

An assertion verifies that the application behaves as expected. In React tests, assertions usually check visible UI, user interactions, validation messages, API result rendering, or error states.

## What Is toBeInTheDocument?

`toBeInTheDocument()` checks that an element exists in the rendered HTML document.

```jsx
expect(screen.getByText("Login")).toBeInTheDocument()
```

Meaning:

```text
Find text "Login"
  |
  v
Check that it is present on the screen
```

Simple example:

```jsx
function Login() {
  return <button>Login</button>
}

test("shows login button", () => {
  render(<Login />)

  expect(screen.getByText("Login")).toBeInTheDocument()
})
```

The test passes because the `Login` button is rendered.

Important:

```text
toBeInTheDocument()
  |
  +-- comes from @testing-library/jest-dom
  +-- not from plain Jest by default
```

That is why the test setup file usually includes:

```js
import "@testing-library/jest-dom"
```

## Basic React Testing Library Test

Component:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>
}
```

Test:

```jsx
import { render, screen } from "@testing-library/react"
import Greeting from "./Greeting"

test("shows greeting message", () => {
  render(<Greeting name="Karteek" />)

  expect(screen.getByText("Hello, Karteek")).toBeInTheDocument()
})
```

What this test checks:

```text
Render component
   |
   v
Find text visible to user
   |
   v
Assert text is present
```

Interview point:

This test does not check internal state. It checks the visible output.

## Query Priority In React Testing Library

React Testing Library encourages accessible queries.

Preferred order:

```text
1. getByRole
2. getByLabelText
3. getByPlaceholderText
4. getByText
5. getByDisplayValue
6. getByTestId only when needed
```

Example:

```jsx
screen.getByRole("button", { name: "Submit" })
```

This is better than:

```jsx
screen.getByTestId("submit-button")
```

because users and screen readers interact with roles and accessible names.

Interview answer:

I prefer `getByRole` because it matches how users and assistive technologies find elements. I use `data-testid` only when there is no better accessible query.

## Testing User Events

Use `userEvent` for realistic user interactions.

Component:

```jsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

Test:

```jsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Counter from "./Counter"

test("increments count when button is clicked", async () => {
  render(<Counter />)

  await userEvent.click(screen.getByRole("button", { name: "Increment" }))

  expect(screen.getByText("Count: 1")).toBeInTheDocument()
})
```

Flow:

```text
Render Counter
   |
   v
User clicks Increment
   |
   v
State updates
   |
   v
UI shows Count: 1
```

### Why is `async` used in this test?

`async` is used because `userEvent.click()` is asynchronous.

React Testing Library's `userEvent` tries to simulate real user behavior more closely than a simple browser event. A real click is not just one event. It can involve multiple steps:

```text
Mouse moves to button
   |
   v
Mouse down
   |
   v
Button receives focus
   |
   v
Mouse up
   |
   v
Click event fires
   |
   v
React updates state
   |
   v
Component re-renders
```

Because React may need a moment to process the state update and update the DOM, we should wait for the click interaction to finish before writing the assertion.

```jsx
test("increments count when button is clicked", async () => {
  render(<Counter />)

  await userEvent.click(screen.getByRole("button", { name: "Increment" }))

  expect(screen.getByText("Count: 1")).toBeInTheDocument()
})
```

Here:

```jsx
async () => {}
```

allows us to use:

```jsx
await userEvent.click(...)
```

If we do not use `await`, the assertion may run before React finishes updating the UI.

Interview answer:

> We use `async` because `userEvent` methods are asynchronous and simulate real user interactions. After the click, React updates state and re-renders the component, so we wait for the interaction to complete before asserting the expected UI.

Interview point:

We test the user behavior, not whether `setCount` was called.

## Testing Forms

Component:

```jsx
import { useState } from "react"

function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <button type="submit">Login</button>
    </form>
  )
}
```

Test:

```jsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginForm from "./LoginForm"

test("submits entered email", async () => {
  const handleSubmit = jest.fn()

  render(<LoginForm onSubmit={handleSubmit} />)

  await userEvent.type(screen.getByLabelText("Email"), "test@example.com")
  await userEvent.click(screen.getByRole("button", { name: "Login" }))

  expect(handleSubmit).toHaveBeenCalledWith("test@example.com")
})
```

Interview point:

For forms, I test what the user types, what validation appears, and what happens on submit.

## Testing Validation

Component:

```jsx
function EmailForm() {
  const [email, setEmail] = useState("")
  const isInvalid = email.length > 0 && !email.includes("@")

  return (
    <form>
      <label>
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      {isInvalid && <p role="alert">Enter a valid email</p>}
    </form>
  )
}
```

Test:

```jsx
test("shows validation error for invalid email", async () => {
  render(<EmailForm />)

  await userEvent.type(screen.getByLabelText("Email"), "wrong-email")

  expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email")
})
```

Why `role="alert"` is useful:

```text
It makes the error accessible.
It also gives the test a meaningful way to find the error message.
```

## Testing API Loading, Success, And Error States

Component:

```jsx
import { useEffect, useState } from "react"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setStatus("success")
      })
      .catch(() => setStatus("error"))
  }, [])

  if (status === "loading") return <p>Loading users...</p>
  if (status === "error") return <p role="alert">Unable to load users</p>

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

Success test idea:

```jsx
test("shows users after API success", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ id: 1, name: "Karteek" }]),
    }),
  )

  render(<UsersPage />)

  expect(screen.getByText("Loading users...")).toBeInTheDocument()
  expect(await screen.findByText("Karteek")).toBeInTheDocument()
})
```

Error test idea:

```jsx
test("shows error when API fails", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("API failed")))

  render(<UsersPage />)

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to load users",
  )
})
```

Interview point:

For API components, I test loading, success, empty, and error states.

## Mocking APIs With MSW

MSW means Mock Service Worker.

It mocks API requests at the network boundary instead of mocking `fetch` or Axios inside the component.

Simple mental model:

```text
Component calls fetch("/api/users")
        |
        v
MSW intercepts request
        |
        v
MSW returns mocked response
        |
        v
Component renders loading/success/error UI
```

For production-quality tests, MSW is often better than mocking `fetch` directly.

Why MSW is useful:

```text
Component still makes a real-looking network request
MSW intercepts it at the network boundary
Tests remain close to real user behavior
```

### MSW Setup Example

File: `src/mocks/handlers.js`

```js
import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "Karteek" },
      { id: 2, name: "React Developer" },
    ])
  }),
]
```

Explanation:

- `http.get("/api/users")` catches GET requests to `/api/users`.
- `HttpResponse.json(...)` sends a mock JSON response.
- Your component does not know the response is mocked.

File: `src/mocks/server.js`

```js
import { setupServer } from "msw/node"
import { handlers } from "./handlers"

export const server = setupServer(...handlers)
```

File: `src/test/setup.js`

```js
import "@testing-library/jest-dom"
import { server } from "../mocks/server"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

Explanation:

```text
beforeAll
  |
  +-- start MSW before tests

afterEach
  |
  +-- reset custom handlers after each test

afterAll
  |
  +-- stop MSW after tests
```

### Component Under Test

```jsx
import { useEffect, useState } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load users")
        }

        return response.json()
      })
      .then((data) => {
        setUsers(data)
        setStatus("success")
      })
      .catch(() => {
        setStatus("error")
      })
  }, [])

  if (status === "loading") return <p>Loading users...</p>
  if (status === "error") return <p role="alert">Unable to load users</p>

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Success Test With MSW

```jsx
import { render, screen } from "@testing-library/react"
import UsersPage from "./UsersPage"

test("shows users after API success", async () => {
  render(<UsersPage />)

  expect(screen.getByText("Loading users...")).toBeInTheDocument()

  expect(await screen.findByText("Karteek")).toBeInTheDocument()
  expect(screen.getByText("React Developer")).toBeInTheDocument()
})
```

What happens:

```text
render(<UsersPage />)
        |
        v
UsersPage calls /api/users
        |
        v
MSW handler returns users
        |
        v
findByText waits until user appears
```

### Error Test With MSW

Sometimes one test needs a different API response. Use `server.use()` to override the handler for that test.

```jsx
import { http, HttpResponse } from "msw"
import { render, screen } from "@testing-library/react"
import { server } from "../mocks/server"
import UsersPage from "./UsersPage"

test("shows error when API fails", async () => {
  server.use(
    http.get("/api/users", () => {
      return new HttpResponse(null, { status: 500 })
    }),
  )

  render(<UsersPage />)

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to load users",
  )
})
```

Explanation:

- The default handler returns success.
- `server.use()` temporarily overrides it.
- `server.resetHandlers()` in setup resets it after the test.

### Empty State Test With MSW

Component can support empty UI:

```jsx
if (status === "success" && users.length === 0) {
  return <p>No users found</p>
}
```

Test:

```jsx
test("shows empty state when API returns no users", async () => {
  server.use(
    http.get("/api/users", () => {
      return HttpResponse.json([])
    }),
  )

  render(<UsersPage />)

  expect(await screen.findByText("No users found")).toBeInTheDocument()
})
```

### MSW Vs Mocking fetch

```text
Mocking fetch
  |
  +-- simple for small tests
  +-- tied to fetch implementation
  +-- needs different setup if app changes to Axios

MSW
  |
  +-- mocks network requests
  +-- works with fetch, Axios, React Query, RTK Query, Apollo
  +-- tests are closer to real app behavior
```

Interview answer:

I prefer MSW for API-heavy React components because it mocks the network layer. The component still calls the real API function, so tests cover loading, success, empty, and error states in a realistic way.

### Resume-Based Example

For a POI/POA document upload flow, MSW can mock:

```text
POST /api/documents/upload -> success response
POST /api/documents/upload -> 400 invalid file
POST /api/documents/upload -> 500 server error
GET /api/onboarding/status -> updated verification status
```

Example handler:

```js
http.post("/api/documents/upload", async () => {
  return HttpResponse.json({
    documentId: "doc-123",
    status: "uploaded",
  })
})
```

Interview answer:

In an onboarding project, I would use MSW to test document upload success, validation failure, server failure, and updated onboarding status without depending on a real backend during tests.

## Snapshot Testing

Snapshot testing stores rendered output and compares it in future test runs.

Example:

```jsx
import { render } from "@testing-library/react"

test("matches snapshot", () => {
  const { container } = render(<Greeting name="Karteek" />)

  expect(container).toMatchSnapshot()
})
```

When useful:

- stable presentational components
- small UI components
- detecting unexpected markup changes

When not useful:

- large dynamic components
- complex forms
- components with frequent UI changes

Interview answer:

Snapshot tests can be useful for stable presentational UI, but I do not rely on them heavily. I prefer behavior-based tests with React Testing Library.

## Testing Custom Hooks

Custom hook:

```jsx
import { useState } from "react"

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = () => setValue((current) => !current)

  return { value, toggle }
}
```

Test idea using a small component:

```jsx
function TestComponent() {
  const { value, toggle } = useToggle(false)

  return (
    <>
      <p>Status: {value ? "ON" : "OFF"}</p>
      <button onClick={toggle}>Toggle</button>
    </>
  )
}

test("toggles value", async () => {
  render(<TestComponent />)

  expect(screen.getByText("Status: OFF")).toBeInTheDocument()

  await userEvent.click(screen.getByRole("button", { name: "Toggle" }))

  expect(screen.getByText("Status: ON")).toBeInTheDocument()
})
```

Interview point:

I test custom hooks through behavior. If the hook is tied to UI behavior, I render a small test component and test the visible result.

## Unit Vs Integration Vs E2E Testing

```text
Unit test
  |
  +-- small function or component
  +-- fast

Integration test
  |
  +-- multiple components working together
  +-- common for React Testing Library

E2E test
  |
  +-- real browser flow
  +-- Playwright or Cypress
```

Recommended approach:

```text
Many unit/integration tests
Some E2E tests for critical user journeys
Few snapshot tests
```

Interview answer:

For a React app, I write more unit and integration tests because they are fast and maintainable. I use E2E tests for critical flows like login, onboarding submission, document upload, and payment flows.

## What To Test In A React Component

Test:

- initial render
- user interaction
- loading state
- error state
- success state
- empty state
- validation messages
- callback behavior
- accessibility basics

Avoid testing:

- internal state directly
- implementation details
- private helper functions through component tests
- exact DOM structure unless required

## Resume-Based Examples

Stablehouse onboarding:

- test POI/POA document upload validation
- test upload button disabled while uploading
- test error message when upload fails
- test successful onboarding status update
- test Liveness Verification fallback state

HNB Digital Lobby:

- test dashboard widgets loading and error states
- test REST API success/failure states
- test reusable table sorting/filtering behavior
- test form submission and validation

Interview answer:

In my Stablehouse onboarding work, I would test document upload flows with React Testing Library by checking file validation, loading state, error state, and successful submission behavior. For API mocking, I would prefer MSW because it keeps tests close to real network behavior.

## Common Interview Questions

What is Jest?

Jest is a JavaScript testing framework used for running tests, assertions, mocks, spies, and coverage.

What is React Testing Library?

React Testing Library is used to render React components and test them from the user's perspective.

Why RTL instead of Enzyme?

RTL encourages testing user behavior instead of component internals. This makes tests less fragile when implementation changes.

What is `screen`?

`screen` provides access to queries for the rendered DOM, such as `getByRole`, `getByText`, and `findByText`.

Example:

```jsx
import { render, screen } from "@testing-library/react"

function SaveButton() {
  return <button>Save</button>
}

test("renders save button", () => {
  render(<SaveButton />)

  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
})
```

Interview answer:

`screen` is used to query elements from the rendered document. It makes tests cleaner because we do not need to destructure queries from `render`.

Difference between `getBy`, `queryBy`, and `findBy`?

```text
getBy
  |
  +-- expects element to exist immediately
  +-- throws if not found

queryBy
  |
  +-- useful when element should not exist
  +-- returns null if not found

findBy
  |
  +-- async
  +-- waits for element to appear
```

Example:

```jsx
screen.getByRole("button", { name: "Submit" })
screen.queryByText("Error message")
await screen.findByText("Loaded data")
```

Interview answer:

I use `getBy` for elements that should already exist, `queryBy` for elements that should not exist, and `findBy` for async UI after API calls or delayed rendering.

How do you test loading and error states?

Component flow:

```text
API call starts
   |
   v
Loading UI shown
   |
   v
API succeeds or fails
   |
   v
Success UI or error UI shown
```

Success test example:

```jsx
expect(screen.getByText("Loading...")).toBeInTheDocument()

expect(await screen.findByText("Karteek")).toBeInTheDocument()
```

Error test example:

```jsx
expect(await screen.findByText("Something went wrong")).toBeInTheDocument()
```

Interview answer:

I test loading, success, empty, and error states separately. For async UI, I use `findBy` or `waitFor`.

What is `waitFor`?

`waitFor` waits until an expectation passes.

```jsx
import { waitFor } from "@testing-library/react"

await waitFor(() => {
  expect(screen.getByText("Saved successfully")).toBeInTheDocument()
})
```

Prefer `findBy` when waiting for an element:

```jsx
await screen.findByText("Saved successfully")
```

Use `waitFor` when checking something more complex, like whether a mock function was called:

```jsx
await waitFor(() => {
  expect(mockSave).toHaveBeenCalledTimes(1)
})
```

Interview answer:

`waitFor` is used when the UI changes asynchronously and we need to wait until an expectation becomes true.

How do you mock functions in Jest?

Use `jest.fn()`.

Component:

```jsx
function SaveButton({ onSave }) {
  return <button onClick={onSave}>Save</button>
}
```

Test:

```jsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

test("calls onSave when clicked", async () => {
  const onSave = jest.fn()

  render(<SaveButton onSave={onSave} />)

  await userEvent.click(screen.getByRole("button", { name: "Save" }))

  expect(onSave).toHaveBeenCalledTimes(1)
})
```

Interview answer:

`jest.fn()` creates a mock function. I use it to verify whether callbacks are called, how many times they are called, and what arguments they receive.

How do you test form input?

Use `userEvent.type`.

Component:

```jsx
function LoginForm() {
  return (
    <form>
      <label>
        Email
        <input />
      </label>
    </form>
  )
}
```

Test:

```jsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

test("allows user to type email", async () => {
  render(<LoginForm />)

  const emailInput = screen.getByLabelText("Email")

  await userEvent.type(emailInput, "karteek@example.com")

  expect(emailInput).toHaveValue("karteek@example.com")
})
```

Interview answer:

I test forms by interacting with inputs like a real user: typing, selecting, checking checkboxes, and submitting the form. I prefer `getByLabelText` because it also validates accessibility.

How do you test API calls?

Test loading, success, and error UI. Mock the API using MSW or a controlled mock.

What is code coverage?

Code coverage measures how much code was executed during tests. It is useful, but high coverage does not always mean high-quality tests.

Good interview summary:

I use Jest as the test runner and assertion/mocking framework. I use React Testing Library to test components from the user's perspective. I prefer accessible queries like `getByRole`, test behavior instead of implementation details, and cover loading, success, error, empty, and validation states. For API mocking, I prefer MSW because it mocks at the network boundary.
