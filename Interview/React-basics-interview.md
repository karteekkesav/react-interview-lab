# React Basics Interview Notes

Purpose: quick interview revision with simple JavaScript examples.

## What Is React?

React is a JavaScript library for building user interfaces using components.

Interview answer:

React helps build reusable, declarative UI. We describe what the UI should look like for a given state, and React updates the DOM efficiently when state changes.

## Why React?

React is popular because it provides:

- component-based architecture
- declarative UI
- one-way data flow
- strong ecosystem
- good performance patterns
- TypeScript support
- large community

Interview answer:

I use React because it helps create reusable components, manage UI state predictably, and build scalable frontend applications.

## JSX

JSX lets us write HTML-like syntax inside JavaScript.

```jsx
function Greeting() {
  const name = "Karteek"

  return <h1>Hello, {name}</h1>
}
```

Important:

```text
JSX is not HTML.
JSX is compiled into JavaScript function calls.
```

Interview answer:

JSX improves readability by letting us describe UI structure close to the JavaScript logic that controls it.

## Components

A component is a reusable piece of UI.

```jsx
function UserCard({ name, role }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{role}</p>
    </article>
  )
}
```

Usage:

```jsx
<UserCard name="Karteek" role="Senior Frontend Developer" />
```

Interview answer:

Components help split UI into small, reusable, testable pieces.

## Normal Function Vs React Function Component

A normal function is a JavaScript function used for logic or calculations.

Example:

```js
function add(a, b) {
  return a + b
}

const result = add(10, 20)
console.log(result) // 30
```

Flow:

```text
Input -> logic -> output
```

A React function component is also a JavaScript function, but React uses it to render UI.

Example:

```jsx
function Welcome() {
  return <h1>Hello Karteek</h1>
}
```

Flow:

```text
Props/state -> JSX -> UI on screen
```

Main difference:

```text
Normal function
  |
  +-- returns data
  +-- called manually
  +-- used for calculations or reusable logic

React function component
  |
  +-- returns JSX
  +-- called by React during rendering
  +-- used to create UI
```

Example with props:

```jsx
function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  )
}
```

Usage:

```jsx
<UserCard name="Karteek" role="Frontend Developer" />
```

We usually do not call a component like a normal function:

```js
UserCard({ name: "Karteek", role: "Frontend Developer" })
```

React calls the component internally when it renders:

```jsx
<UserCard name="Karteek" role="Frontend Developer" />
```

Hooks difference:

```text
Normal function -> cannot use React hooks
React component -> can use React hooks
Custom hook     -> can use React hooks
```

Wrong:

```jsx
function calculateTotal() {
  const [count, setCount] = useState(0) // wrong
  return count
}
```

Correct React component:

```jsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

Custom hook exception:

```jsx
function useCounter() {
  const [count, setCount] = useState(0)

  return { count, setCount }
}
```

Naming rule:

```text
productList -> treated like lowercase/custom HTML-like tag
ProductList -> treated like React component
```

React components should start with a capital letter.

Interview answer:

A normal function is a JavaScript function used for calculations or reusable logic. A React function component is also a function, but React treats it as a UI component because it returns JSX and is used like `<Component />`. React components can receive props, use state and hooks, and React calls them during rendering. Normal functions are called manually and usually return data, not UI.

Quick memory trick:

```text
Normal function -> returns value
React component -> returns view
```

## How A React Component Renders In Browser

Big picture:

```text
Browser loads HTML
  |
  v
JavaScript bundle loads
  |
  v
React starts from root
  |
  v
React calls components
  |
  v
Components return JSX
  |
  v
React creates React element tree
  |
  v
React compares changes
  |
  v
React updates real DOM
  |
  v
Browser paints UI
```

React app usually starts from a root file:

```jsx
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(<App />)
```

React finds this HTML element:

```html
<div id="root"></div>
```

Then React renders `<App />` inside it.

### How Components Render

A React function component is a function that returns JSX.

```jsx
function App() {
  return <h1>Hello React</h1>
}
```

We usually use it like this:

```jsx
<App />
```

React internally calls the component function.

Flow:

```text
<App />
  |
  v
React calls App()
  |
  v
App returns JSX
  |
  v
React converts JSX to React elements
  |
  v
React updates DOM
  |
  v
Browser shows UI
```

### How JSX Renders

JSX looks like HTML, but it is JavaScript syntax.

```jsx
const element = <h1>Hello</h1>
```

Conceptually, JSX becomes a React element:

```js
React.createElement("h1", null, "Hello")
```

React element object:

```js
{
  type: "h1",
  props: {
    children: "Hello"
  }
}
```

Flow:

```text
JSX
  |
  v
React element object
  |
  v
React element tree
  |
  v
Real DOM update
  |
  v
Browser paint
```

### How Hooks Render

Hooks do not render by themselves.

Hooks let a component use React features like state, effect, ref, memo, and context.

Example:

```jsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

First render:

```text
React calls Counter()
  |
  v
useState(0) creates state with value 0
  |
  v
JSX returns Count: 0
  |
  v
React updates DOM
  |
  v
Browser shows Count: 0
```

When user clicks:

```jsx
setCount(count + 1)
```

React schedules a re-render.

```text
User clicks button
  |
  v
setCount(1)
  |
  v
React schedules re-render
  |
  v
React calls Counter() again
  |
  v
useState returns latest value: 1
  |
  v
JSX returns Count: 1
  |
  v
React compares old UI and new UI
  |
  v
Only changed DOM is updated
  |
  v
Browser shows Count: 1
```

Important:

```text
Calling setState does not directly change the DOM.
It tells React to re-render the component with new state.
```

### How useEffect Runs

`useEffect` runs after React commits the UI update to the screen.

```jsx
import { useEffect, useState } from "react"

function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
  }, [])

  return <p>Total users: {users.length}</p>
}
```

Flow:

```text
Component renders first time
  |
  v
users = []
  |
  v
Browser shows Total users: 0
  |
  v
useEffect runs
  |
  v
API call starts
  |
  v
API returns data
  |
  v
setUsers(data)
  |
  v
Component re-renders
  |
  v
Browser shows updated users count
```

Simple rule:

```text
render first
effect later
```

### How Normal Functions Work During Render

A normal JavaScript function does not render UI by itself.

```js
function add(a, b) {
  return a + b
}

add(10, 20) // 30
```

But a normal function can be called inside a React component to prepare data.

```jsx
function formatName(name) {
  return name.toUpperCase()
}

function User() {
  return <h1>{formatName("karteek")}</h1>
}
```

Flow:

```text
React calls User()
  |
  v
User calls formatName("karteek")
  |
  v
formatName returns "KARTEEK"
  |
  v
JSX becomes <h1>KARTEEK</h1>
  |
  v
React renders UI
```

So the normal function helps calculate data. The React component renders UI.

### React Render Vs Browser Render

React render means:

```text
React calls component functions
React creates React elements
React compares old and new tree
```

Browser render means:

```text
Browser applies DOM changes
Browser calculates layout
Browser paints pixels on screen
```

Visual:

```text
React render
  |
  +-- call components
  +-- create JSX tree
  +-- compare changes

Browser render
  |
  +-- apply DOM changes
  +-- calculate layout
  +-- paint screen
```

Full example:

```jsx
import { useEffect, useState } from "react"

function getGreeting(name) {
  return `Hello ${name}`
}

function App() {
  const [name, setName] = useState("Karteek")

  useEffect(() => {
    document.title = name
  }, [name])

  return (
    <div>
      <h1>{getGreeting(name)}</h1>
      <button onClick={() => setName("React")}>
        Change Name
      </button>
    </div>
  )
}
```

First render:

```text
React calls App()
  |
  v
useState("Karteek") gives name = "Karteek"
  |
  v
getGreeting("Karteek") returns "Hello Karteek"
  |
  v
JSX returns UI
  |
  v
React updates DOM
  |
  v
Browser paints UI
  |
  v
useEffect runs and updates document title
```

After button click:

```text
User clicks button
  |
  v
setName("React")
  |
  v
React calls App() again
  |
  v
useState returns latest name = "React"
  |
  v
getGreeting("React") returns "Hello React"
  |
  v
New JSX is created
  |
  v
React compares old UI and new UI
  |
  v
Only changed text is updated in DOM
  |
  v
Browser paints updated UI
  |
  v
useEffect runs again because name changed
```

Interview answer:

In React, rendering starts when `createRoot().render(<App />)` is called. React calls function components, components return JSX, and JSX is converted into React element objects. React builds a tree, compares it with the previous tree, and updates only the required parts of the real DOM. Hooks do not render by themselves; they provide features like state and effects inside components. When state changes through a hook like `useState`, React re-renders the component. Normal JavaScript functions do not render UI directly, but they can be called inside components to calculate values used in JSX.

Memory trick:

```text
Normal function -> returns data
React component -> returns JSX
JSX -> becomes React element
Hook -> stores state/effect logic
React -> updates DOM
Browser -> paints screen
```

## Component Communication

React components communicate through props, callbacks, context, or shared state.

```text
Parent -> Child       props
Child -> Parent       callback function
Sibling -> Sibling    lift state to common parent
Deep tree             Context or state management
```

```jsx
function Parent() {
  const [message, setMessage] = useState("")

  return (
    <div>
      <Child onSendMessage={setMessage} />
      <p>Message: {message}</p>
    </div>
  )
}

function Child({ onSendMessage }) {
  return (
    <button onClick={() => onSendMessage("Hello from child")}>
      Send Message
    </button>
  )
}
```

Interview answer:

Parent-to-child communication happens through props. Child-to-parent communication happens by passing callback functions from the parent to the child.

## Children Prop

`children` is a special prop used to pass JSX between opening and closing component tags.

```jsx
function Card({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function App() {
  return (
    <Card title="Profile">
      <p>Karteek</p>
      <button>Edit</button>
    </Card>
  )
}
```

Interview answer:

I use `children` when a component provides layout or styling but the parent controls the inner content.

## Fragments

Fragments let us return multiple elements without adding an extra DOM node.

```jsx
function UserDetails() {
  return (
    <>
      <h2>Karteek</h2>
      <p>Frontend Developer</p>
    </>
  )
}
```

Interview answer:

Fragments are useful when a component needs to return multiple sibling elements but we do not want unnecessary wrapper `div`s.

## Props Vs State

Props are passed from parent to child.

State is owned and updated by the component.

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>
}
```

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

Interview answer:

Props are read-only inputs from the parent. State is internal data that changes over time and causes re-renders.

## Conditional Rendering

Conditional rendering means showing different UI based on state or props.

```jsx
function UserStatus({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <p>Please login</p>
  }

  return <p>Welcome back</p>
}
```

Another example:

```jsx
{isLoading ? <p>Loading...</p> : <UserList />}
```

Interview answer:

React uses normal JavaScript conditions to decide what UI should be rendered.

## Prop Drilling

Prop drilling means passing props through multiple levels just to reach a deeply nested component.

```jsx
function App() {
  const user = { name: "Karteek" }
  return <Layout user={user} />
}

function Layout({ user }) {
  return <Sidebar user={user} />
}

function Sidebar({ user }) {
  return <UserMenu user={user} />
}
```

```text
App -> Layout -> Sidebar -> UserMenu
```

Interview answer:

For small cases, prop drilling is fine. If many unrelated components need the same value, I use Context or Redux.

## Portals

Portals render a component outside the normal parent DOM hierarchy.

```jsx
import { createPortal } from "react-dom"

function Modal({ children }) {
  return createPortal(
    <div role="dialog" aria-modal="true">
      {children}
    </div>,
    document.body,
  )
}
```

Interview answer:

Portals are useful for modals, dropdowns, tooltips, and overlays because they avoid parent overflow or z-index issues.

## Lists And Keys

Use `map` to render lists.

```jsx
function SkillsList() {
  const skills = ["React", "Redux", "GraphQL"]

  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  )
}
```

Keys help React identify list items between renders.

```text
key
= React rendering identity
```

Avoid array index as key for dynamic lists because state can stick to the wrong item after sorting, deleting, or inserting.

Interview answer:

Keys help React preserve component identity during reconciliation. Stable IDs from backend data are usually best.

## key Vs data-id

`key` is used by React internally.

`data-id` is a DOM attribute used by our code.

```jsx
function ListExample({ items }) {
  function handleClick(event) {
    const id = event.target.dataset.id
    console.log("Clicked:", id)
  }

  return (
    <ul onClick={handleClick}>
      {items.map((item) => (
        <li key={item.id} data-id={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

```text
key={item.id}
= helps React reconcile list items

data-id={item.id}
= helps event handler know which item was clicked
```

## Virtual DOM

The Virtual DOM is React's in-memory representation of the UI.

Flow:

```text
State changes
   |
   v
React creates new virtual tree
   |
   v
React compares old and new trees
   |
   v
React updates only necessary DOM parts
```

Interview answer:

The Virtual DOM helps React calculate UI changes before applying them to the real DOM. The real DOM can be expensive, so React tries to update only what changed.

## Reconciliation

Reconciliation is the process React uses to compare the previous tree with the new tree.

```text
Old React tree
   |
   v
Compare with new React tree
   |
   v
Find changes
   |
   v
Update DOM
```

Interview answer:

Reconciliation is how React decides what changed and what needs to update in the DOM.

## Diffing Algorithm

React's diffing algorithm compares old and new UI trees.

Important assumptions:

- Different element types create different trees.
- Same element type can reuse existing DOM.
- Keys help match list items.

Example:

```jsx
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

Interview answer:

React uses element type and key to decide whether to preserve, update, move, or recreate elements.

### Reconciliation And Keys: Interview Deep Dive

Mental model: React compares element identity first, then updates details.

```text
Same position + same type + same key
  -> preserve component/DOM identity and state

Different type or different key
  -> remove old subtree and mount a new subtree
```

For example, changing a node from `<UserCard />` to `<AdminCard />` at the same position creates a different subtree. React does not try to convert one component's state into the other's state.

For a list, position alone is unreliable because items can move. A key tells React which new child corresponds to which previous child among the same parent’s children.

```jsx
function TodoList({ todos }) {
  return todos.map((todo) => (
    <TodoRow key={todo.id} todo={todo} />
  ))
}
```

Real-time scenario: each `TodoRow` contains an editing input. If the first todo is deleted, stable ID keys let React preserve the editing state with the correct remaining todo.

Using an array index can attach state to the wrong data after insertion, deletion, or sorting:

```jsx
// Risky when the list can change order.
{todos.map((todo, index) => (
  <TodoRow key={index} todo={todo} />
))}
```

After deleting item zero, the next item now receives key `0`, so React may reuse the old row instance and its local input state for different data.

Key facts:

- A key needs to be unique only among siblings, not across the whole application.
- A key should be stable and come from the data, such as a database ID.
- `key` is consumed by React and is not available as a normal component prop.
- `Math.random()` creates a new identity each render and forces remounts.
- Changing a key intentionally resets a component and its local state.
- A key helps React match identity; it is not a general performance switch.

Intentional state reset example:

```jsx
<CustomerForm key={customerId} customerId={customerId} />
```

When `customerId` changes, React mounts a fresh form instead of preserving the previous customer's draft state.

Interview answer:

Reconciliation compares the previous and next React trees to decide what can be preserved and what must be updated or replaced. Element type and key define identity. In lists, stable keys let React match items across moves, insertions, and deletions, preserving state with the correct item.

## React Fiber

React Fiber is React's internal rendering architecture.

Interview-level explanation:

Fiber lets React split rendering work into smaller units. This helps React pause, resume, prioritize, or discard rendering work in modern React.

```text
React update
  |
  v
Fiber breaks work into units
  |
  v
React can prioritize urgent work
  |
  v
Commit final DOM update
```

Interview answer:

Fiber is React's internal engine that enables modern rendering features like interruptible rendering and prioritization.

## React Rendering Lifecycle

Modern function component lifecycle:

```text
Mount
  |
  v
Render
  |
  v
Commit DOM updates
  |
  v
Run effects
  |
  v
Update when state/props/context change
  |
  v
Cleanup on re-run or unmount
```

Render phase:

```text
React calculates what UI should look like.
Should be pure.
```

Commit phase:

```text
React applies changes to the DOM.
Effects run after commit.
```

Interview answer:

Render should not contain side effects. API calls, subscriptions, timers, and DOM interactions should be handled in effects or event handlers.

## Pure Component

A pure component returns the same output for the same props and state.

```jsx
function Greeting({ name }) {
  return <h2>Hello, {name}</h2>
}
```

Not pure:

```jsx
function BadGreeting({ name }) {
  return <h2>Hello, {name}. Random: {Math.random()}</h2>
}
```

Why not pure:

```text
Same props -> different output
```

Interview answer:

A pure component has predictable output and does not cause side effects during render.

## Synthetic Events

Synthetic events are React's wrapper around browser events.

```jsx
function SyntheticEventExample() {
  function handleClick(event) {
    console.log("Synthetic event:", event)
    console.log("Button text:", event.currentTarget.textContent)
    console.log("Native event:", event.nativeEvent)
  }

  return <button onClick={handleClick}>Click me</button>
}
```

Interview answer:

React normalizes browser events so event handling is consistent across browsers. We still use familiar handlers like `onClick`, `onChange`, and `onSubmit`.

## Event Delegation

Event delegation means using a parent handler to handle events from child elements.

```jsx
function ListExample() {
  function handleListClick(event) {
    const id = event.target.dataset.id

    if (id) {
      console.log("Clicked:", id)
    }
  }

  return (
    <ul onClick={handleListClick}>
      <li data-id="1">React</li>
      <li data-id="2">Redux</li>
      <li data-id="3">Router</li>
    </ul>
  )
}
```

Interview answer:

React uses event delegation internally. Instead of attaching separate native listeners to every element, React manages events efficiently and dispatches synthetic events to handlers.

## Bubbling And Capturing

```jsx
onClick         // bubbling phase
onClickCapture  // capturing phase
```

Example:

```jsx
function EventPhasesExample() {
  function handleParentCapture() {
    console.log("Parent capture")
  }

  function handleParentBubble() {
    console.log("Parent bubble")
  }

  function handleChildClick() {
    console.log("Child click")
  }

  return (
    <div onClickCapture={handleParentCapture} onClick={handleParentBubble}>
      <button onClick={handleChildClick}>Click child</button>
    </div>
  )
}
```

Clicking the button logs:

```text
Parent capture
Child click
Parent bubble
```

Stop bubbling:

```jsx
function handleButtonClick(event) {
  event.stopPropagation()
}
```

Interview answer:

Normal handlers like `onClick` run during bubbling. Capture handlers like `onClickCapture` run during capturing. Use `stopPropagation` when a child event should not trigger parent handlers.

## Batch Updates

Batching means React groups multiple state updates into one render.

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  function handleClick() {
    setCount(count + 1)
    setFlag(true)
  }
}
```

React can batch both updates into one render.

Interview answer:

Batching improves performance by reducing unnecessary renders. React 18 expanded automatic batching to more async scenarios.

## Stale Update

A stale update happens when state update logic uses an old state value.

Problem:

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }
}
```

If `count` is `0`, the final value may be `1`, not `3`.

Fix:

```jsx
function handleClick() {
  setCount((previousCount) => previousCount + 1)
  setCount((previousCount) => previousCount + 1)
  setCount((previousCount) => previousCount + 1)
}
```

Interview answer:

When the next state depends on previous state, use the functional updater form to avoid stale updates.

## flushSync

`flushSync` forces React to apply updates immediately.

```jsx
import { flushSync } from "react-dom"

function addTodo() {
  flushSync(() => {
    setTodos((currentTodos) => [...currentTodos, "New Todo"])
  })

  listRef.current.lastElementChild.scrollIntoView()
}
```

Use rarely when you must update state and immediately read or use the updated DOM.

Interview answer:

`flushSync` is an escape hatch. It forces synchronous DOM updates, useful for rare cases like scrolling to a newly added item or measuring an element immediately after it appears. Overuse hurts performance.

## React 17 Vs 18 Vs 19

React 17:

- smoother upgrades
- event delegation changed from document level to root container

React 18:

- `createRoot`
- automatic batching
- concurrent rendering foundation
- `useTransition`
- `useDeferredValue`

React 19:

- modern async improvements
- form actions
- `useOptimistic`
- `useFormStatus`
- `use`
- improved server/client integration in frameworks

Interview answer:

React 17 focused on upgrades. React 18 introduced concurrent rendering foundations and broader batching. React 19 improves async workflows, forms, optimistic UI, and server integration.

### React 19 Features Explained

React 19 improves how React works with asynchronous operations like form submissions, server actions, promises, pending UI, and optimistic updates.

Before React 19 patterns, we often handled async state manually:

```jsx
const [loading, setLoading] = useState(false)
const [error, setError] = useState("")

async function handleSubmit() {
  try {
    setLoading(true)
    await saveData()
  } catch {
    setError("Something went wrong")
  } finally {
    setLoading(false)
  }
}
```

React 19 gives better patterns for async form and server workflows.

## Form Actions

Form Actions allow forms to directly call a function when submitted.

```jsx
async function saveUser(formData) {
  const name = formData.get("name")
  await updateUser(name)
}

function ProfileForm() {
  return (
    <form action={saveUser}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

Interview point:

Form Actions reduce boilerplate for form submission logic, especially in frameworks that support server actions.

### How Was Form Submission Handled Before React 19?

Before React 19, form submission was commonly handled using `onSubmit`, `useState`, `event.preventDefault()`, and manual loading/error state.

```jsx
import { useState } from "react"

function ProfileForm() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      await updateUser(name)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  )
}
```

Flow before React 19:

```text
User submits form
        |
        v
onSubmit runs
        |
        v
event.preventDefault()
        |
        v
Read value from React state
        |
        v
Call API / async function
        |
        v
Manually manage loading and error state
```

With React 19 Form Actions:

```text
User submits form
        |
        v
Form action function runs
        |
        v
Action receives FormData
        |
        v
Call async logic directly
```

Main difference:

```text
Before React 19:
form submit -> onSubmit -> preventDefault -> read state -> call API -> manage loading manually

React 19:
form submit -> action function receives FormData -> call async logic directly
```

Interview answer:

> Before React 19, we commonly used `onSubmit`, controlled inputs, `preventDefault`, and manual loading/error state. In React 19, Form Actions allow the form to directly call an async function using the `action` prop. This reduces boilerplate and makes async form handling cleaner, especially with server actions and frameworks that support them.

## useOptimistic

`useOptimistic` is used for optimistic UI updates.

Example: user clicks Like. We show the like immediately before the server confirms.

```jsx
import { useOptimistic } from "react"

function LikeButton({ initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (currentLikes) => currentLikes + 1,
  )

  async function handleLike() {
    addOptimisticLike()
    await saveLikeToServer()
  }

  return <button onClick={handleLike}>Likes: {optimisticLikes}</button>
}
```

Flow:

```text
User clicks Like
  |
  v
UI updates immediately
  |
  v
API request goes to server
  |
  v
Server confirms or fails
```

Interview point:

`useOptimistic` improves perceived performance. If the server fails, we should rollback or refetch real data.

## useFormStatus

`useFormStatus` helps check if a form is currently submitting.

```jsx
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  )
}
```

Usage:

```jsx
function ProfileForm() {
  return (
    <form action={saveUser}>
      <input name="name" />
      <SubmitButton />
    </form>
  )
}
```

Interview point:

`useFormStatus` is useful for disabling submit buttons and showing loading text during form submission.

## use Hook

`use()` can read promises or context in supported React environments.

Conceptual example:

```jsx
import { use } from "react"

function UserProfile({ userPromise }) {
  const user = use(userPromise)

  return <h2>{user.name}</h2>
}
```

Interview point:

`use()` is mostly important with Suspense and modern frameworks. It is not something we casually use everywhere in normal client components.

## Improved Server/Client Integration

React 19 improves patterns used by frameworks like Next.js.

```text
Server
  |
  +-- fetch data
  +-- handle server actions
  +-- reduce client JavaScript

Client
  |
  +-- handle interactions
  +-- state
  +-- events
```

Interview answer:

React 19 improves async workflows, form handling, optimistic updates, and server/client integration. In interviews, I would explain that React 19 is especially useful for modern framework-based apps where forms, server actions, Suspense, and server components are used.

## Error Boundaries

Error Boundaries catch render-time errors in child components and show fallback UI instead of crashing the whole app.

Class component example:

```jsx
import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.log("Error:", error)
    console.log("Info:", info)
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong.</p>
    }

    return this.props.children
  }
}
```

Usage:

```jsx
<ErrorBoundary>
  <DashboardWidget />
</ErrorBoundary>
```

Important:

```text
Error Boundaries catch:
- render errors
- lifecycle errors
- constructor errors in child class components

They do not catch:
- event handler errors
- async errors
- promise rejections
- server-side rendering errors
```

Interview answer:

I use Error Boundaries around routes, dashboards, third-party widgets, document upload modules, or other high-risk UI sections. Event and async errors still need `try/catch` and API error states.
