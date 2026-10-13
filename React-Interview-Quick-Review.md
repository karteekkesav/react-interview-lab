# React Interview Quick Review

Use this as a fast revision sheet before interviews. Each answer is written in a way you can speak during an interview, then expand if the interviewer asks follow-up questions.

## React Fundamentals

### 1. What is React?

React is a JavaScript library for building user interfaces. It helps developers create reusable components and efficiently update the UI when data changes.

React focuses on the view layer. It does not force a full application architecture by itself, so routing, data fetching, forms, and state management are usually handled with React patterns or additional libraries.

### 2. What is JSX?

JSX is a syntax extension that lets us write markup-like code inside JavaScript or TypeScript. JSX is compiled into React function calls.

JSX is not HTML. Attributes use JavaScript-friendly names like `className`, `htmlFor`, and `onClick`. JavaScript expressions can be used inside `{}`.

### 3. What are components?

Components are reusable pieces of UI. In modern React, components are usually functions that receive props and return JSX.

A good component has a clear responsibility, explicit props, and predictable rendering. Larger screens are built by composing smaller components.

### 4. What are props?

Props are read-only inputs passed from a parent component to a child component.

They allow data and callbacks to flow downward. A child should not mutate props. If the child needs to request a change, the parent passes a callback prop such as `onSelect`, `onChange`, or `onSubmit`.

### 5. What is state?

State is component-owned data that can change over time. When state changes, React re-renders the component.

Use state for values that affect what the user sees, such as form input, selected tab, loading status, or fetched data state. Do not store values in state if they can be derived from existing props or state.

### 6. Props vs state?

Props are received from a parent. State is owned by the component.

Props are read-only from the child’s perspective. State is updated through React setters like `setState` or dispatch functions from `useReducer`.

### 7. What is conditional rendering?

Conditional rendering means displaying different UI based on state, props, or computed conditions.

Common patterns include early returns, ternary operators, logical `&&`, and mapping explicit view states like `loading`, `error`, `empty`, and `success`.

### 8. Why are keys important?

Keys help React identify items in a list between renders. They preserve the correct component identity during insertions, deletions, and reordering.

Stable IDs from data are best. Avoid array indexes for dynamic lists because state can stick to the wrong item after reordering.

### Additional: What are synthetic events in React?

Synthetic events are React's wrapper around native browser events. They give a consistent event API across browsers while still exposing familiar properties like `target`, `currentTarget`, `type`, `preventDefault`, and `stopPropagation`.

In interviews, say this clearly: React normalizes browser events so event handling feels consistent. In TypeScript, we usually type them with React event types such as `React.ChangeEvent<HTMLInputElement>` or `React.MouseEvent<HTMLButtonElement>`.

Simple JSX example:

```jsx
function SyntheticEventExample() {
  function handleClick(event) {
    console.log("React synthetic event:", event)
    console.log("Button text:", event.currentTarget.textContent)
    console.log("Native browser event:", event.nativeEvent)
  }

  function handleChange(event) {
    console.log("Input value:", event.target.value)
  }

  return (
    <div>
      <button onClick={handleClick}>
        Click me
      </button>

      <input
        type="text"
        placeholder="Type something"
        onChange={handleChange}
      />
    </div>
  )
}
```

What this means:

- `event` is the React Synthetic Event.
- `event.target` is the element where the event started.
- `event.currentTarget` is the element where the handler is attached.
- `event.currentTarget.textContent` reads the button text in this example.
- `event.nativeEvent` gives access to the original browser event if needed.

Flow:

```text
User clicks or types
   |
   v
Browser creates native event
   |
   v
React wraps it as Synthetic Event
   |
   v
Your JSX handler receives event
```

Interview line:

Synthetic events are React's wrapper around browser events. We use them like normal events in JSX, such as `onClick` or `onChange`, and React gives consistent event behavior across browsers.

### Additional: What is event delegation in React?

Event delegation means handling events from many child elements through fewer parent-level listeners.

React uses event delegation internally. Instead of attaching a separate native listener to every element, React listens at a higher level and dispatches synthetic events to the correct component handlers.

Before React 17, React attached many delegated event listeners at the `document` level. From React 17 onward, React attaches event listeners to the root container where the React tree is rendered. This change made it easier to gradually upgrade React and embed multiple React versions on the same page.

Interview answer:

Event delegation improves performance and centralizes event handling. React still lets us write handlers directly on JSX elements, but internally it uses delegation to manage events efficiently.

### Event bubbling and capturing in React event delegation

React supports both bubbling and capturing phases.

```jsx
onClick         // bubbling phase
onClickCapture  // capturing phase
```

Event flow:

```text
Capture phase
Document -> Parent -> Child

Target phase
Actual clicked element

Bubble phase
Child -> Parent -> Document
```

Simple example:

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
    <div
      onClickCapture={handleParentCapture}
      onClick={handleParentBubble}
    >
      Parent

      <button onClick={handleChildClick}>
        Click child
      </button>
    </div>
  )
}
```

When clicking the child button:

```text
Parent capture
Child click
Parent bubble
```

Why this happens:

The capture handler runs from parent to child first. Then the target handler runs. Then the bubbling handler runs from child back to parent.

Stopping bubbling:

```jsx
function StopBubblingExample() {
  function handleCardClick() {
    console.log("Card clicked")
  }

  function handleButtonClick(event) {
    event.stopPropagation()
    console.log("Button clicked")
  }

  return (
    <div onClick={handleCardClick}>
      <p>Card area</p>

      <button onClick={handleButtonClick}>
        Delete
      </button>
    </div>
  )
}
```

When clicking the button:

```text
Button clicked
```

The parent card click will not run because `event.stopPropagation()` stops the event from bubbling to the parent handler.

Delegated list example:

```jsx
function ListExample() {
  function handleListClick(event) {
    const itemId = event.target.dataset.id

    if (itemId) {
      console.log("Clicked item:", itemId)
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

Instead of adding `onClick` to every `li`, one handler on `ul` can handle clicks from all child items.

Difference between `key` and `data-id`:

```text
key
= used by React internally during rendering

data-id
= custom HTML attribute used by your code or DOM/event handling
```

`key` helps React identify list items between renders:

```jsx
{items.map((item) => (
  <li key={item.id}>
    {item.name}
  </li>
))}
```

React uses `key` during reconciliation to understand which item is the same, moved, added, or removed.

Important:

You cannot read `key` from the DOM or from component props:

```jsx
function Item(props) {
  console.log(props.key) // undefined
}
```

`data-id` is rendered to the DOM as a real HTML attribute:

```jsx
<li data-id={item.id}>
  {item.name}
</li>
```

You can read it from events:

```jsx
function handleClick(event) {
  console.log(event.target.dataset.id)
}
```

Using both together:

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

Here:

```text
key={item.id}
```

helps React render the list correctly.

```text
data-id={item.id}
```

helps your click handler know which item was clicked.

Interview answer:

`key` is a React-only attribute used for reconciliation when rendering lists. It helps React preserve component identity during updates. `data-id` is a real HTML custom data attribute rendered to the DOM and can be read through `dataset`, often used in event delegation to identify which element was clicked. Use `key` for React rendering identity and `data-id` for DOM/event metadata.

`target` vs `currentTarget`:

```jsx
function handleClick(event) {
  console.log(event.target)
  console.log(event.currentTarget)
}
```

```text
event.target
= actual element clicked

event.currentTarget
= element where handler is attached
```

In this delegated event:

```jsx
<ul onClick={handleListClick}>
  <li>React</li>
</ul>
```

If the user clicks `li`:

```text
event.target = li
event.currentTarget = ul
```

Interview answer:

React supports both bubbling and capturing phases. Normal handlers like `onClick` run during bubbling, while handlers like `onClickCapture` run during capturing. React also uses event delegation internally, so events can be handled efficiently through parent-level listeners. We can use `event.target` to know where the event started, `event.currentTarget` to know where the handler is attached, and `event.stopPropagation()` when we want to prevent the event from bubbling to parent handlers.

## Hooks

### 9. What are hooks?

Hooks are functions that let function components use React features such as state, effects, refs, context, and memoization.

Examples include `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useReducer`, and custom hooks.

### 10. What are the Rules of Hooks?

Hooks must be called at the top level of React function components or custom hooks. Do not call hooks inside loops, conditions, nested functions, or regular JavaScript functions.

React relies on hook call order to connect state and effects correctly across renders.

### 11. What is `useEffect`?

`useEffect` synchronizes a component with something outside React rendering, such as APIs, timers, subscriptions, localStorage, or document APIs.

Effects run after render. Cleanup runs before the effect re-runs and when the component unmounts. Avoid using effects for values that can be calculated during render.

### 12. What is the dependency array in `useEffect`?

The dependency array tells React when to re-run the effect.

If a value used inside the effect can change over time, it usually belongs in the dependency array. Missing dependencies can cause stale values and bugs.

### 13. What is `useRef`?

`useRef` stores a mutable value that persists across renders without causing re-renders when it changes.

It is commonly used for DOM access, timer IDs, previous values, and mutable values that do not directly affect UI.

Example 1: access a DOM element:

```jsx
import { useRef } from "react"

function FocusInputExample() {
  const inputRef = useRef(null)

  function handleFocus() {
    inputRef.current.focus()
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Enter name" />

      <button onClick={handleFocus}>
        Focus Input
      </button>
    </div>
  )
}
```

Use case: focus input, scroll to section, or play/pause video.

Example 2: store value without re-render:

```jsx
import { useRef, useState } from "react"

function RenderCountExample() {
  const [name, setName] = useState("")
  const renderCount = useRef(0)

  renderCount.current = renderCount.current + 1

  return (
    <div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Type name"
      />

      <p>Render count: {renderCount.current}</p>
    </div>
  )
}
```

Important:

```text
Changing ref.current does not cause re-render.
```

Example 3: store previous value:

```jsx
import { useEffect, useRef, useState } from "react"

function PreviousValueExample() {
  const [count, setCount] = useState(0)
  const previousCount = useRef(null)

  useEffect(() => {
    previousCount.current = count
  }, [count])

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Previous count: {previousCount.current}</p>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

Flow:

```text
Render with count = 0
  |
  v
previousCount is null

Click increment
  |
  v
count becomes 1
  |
  v
render shows current 1, previous 0
```

Example 4: store timer ID:

```jsx
import { useRef } from "react"

function TimerRefExample() {
  const timerId = useRef(null)

  function startTimer() {
    timerId.current = setInterval(() => {
      console.log("Running timer")
    }, 1000)
  }

  function stopTimer() {
    clearInterval(timerId.current)
  }

  return (
    <div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  )
}
```

Interview explanation:

`useRef` is used to store a mutable value that persists across renders without causing re-renders when it changes. It is commonly used to access DOM elements, store timer IDs, keep previous values, or hold mutable values like WebSocket instances. Unlike state, updating `ref.current` does not trigger a component re-render.

### 14. What is `useMemo`?

`useMemo` memoizes a calculated value and recalculates it only when dependencies change.

Use it for expensive derived calculations or when referential stability matters. Do not use it everywhere by default.

### 15. What is `useCallback`?

`useCallback` memoizes a function reference until its dependencies change.

It is useful when passing callbacks to memoized child components or when a stable callback is needed as a hook dependency.

### 16. What is `useReducer`?

`useReducer` manages state using a reducer function and dispatched actions.

It is useful when state transitions are related or complex, such as multi-step forms, grouped state, or action-driven updates.

Simple mental model:

```text
User clicks button
   |
   v
dispatch({ type: "increment" })
   |
   v
reducer(currentState, action)
   |
   v
returns new state
   |
   v
component re-renders
```

Simple JavaScript example in one file:

```jsx
import { useReducer } from "react"

const initialState = {
  count: 0,
}

function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 }

    case "decrement":
      return { count: state.count - 1 }

    case "reset":
      return initialState

    default:
      return state
  }
}

export default function CounterExample() {
  const [state, dispatch] = useReducer(counterReducer, initialState)

  return (
    <div>
      <h2>Count: {state.count}</h2>

      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  )
}
```

Can all code be written in a single file?

Yes. For small interview examples, learning examples, and machine coding rounds, it is completely fine to keep `initialState`, `reducer`, and the component in one file.

For a real project, you may separate it:

```text
CounterExample.jsx
counterReducer.js
```

Interview line:

For small examples, I keep `initialState`, `reducer`, and component in one file. For larger projects, I move reducer logic into a separate file to keep the component clean.

### 17. What are custom hooks?

Custom hooks are reusable functions that use React hooks internally.

They start with `use`, such as `useFetch` or `useLocalStorage`, and help extract reusable stateful logic from components.

Simple JavaScript example:

```jsx
import { useState } from "react"

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  function toggle() {
    setValue((previousValue) => !previousValue)
  }

  return {
    value,
    toggle,
  }
}

export default function ToggleExample() {
  const { value, toggle } = useToggle(false)

  return (
    <div>
      <p>Status: {value ? "ON" : "OFF"}</p>

      <button onClick={toggle}>
        Toggle
      </button>
    </div>
  )
}
```

What is happening:

```text
useToggle contains reusable state logic
        |
        v
ToggleExample uses the hook
        |
        v
Button click calls toggle()
        |
        v
State changes true/false
        |
        v
Component re-renders
```

Why create a custom hook?

Without a custom hook, toggle logic stays inside one component. With a custom hook, the same logic can be reused in multiple places.

Example:

```jsx
const menu = useToggle(false)
const modal = useToggle(false)
const sidebar = useToggle(true)
```

Interview explanation:

A custom hook is a reusable function that starts with `use` and can call other React hooks inside it. It helps extract reusable stateful logic from components. For example, `useToggle` manages true/false state and returns the current value plus a toggle function.

### Additional: How is `useEffect` used, and what are its pros and cons?

`useEffect` is used to synchronize a component with something outside React's render process.

Common use cases:

- Fetching data after a component renders.
- Setting up timers.
- Subscribing to browser events.
- Reading or writing browser APIs like `localStorage`.
- Updating `document.title`.
- Cleaning up subscriptions when a component unmounts.

Daily-use examples:

1. API call when component loads:

```jsx
import { useEffect, useState } from "react"

function UsersList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
  }, [])

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

Use case: fetch user profile, dashboard data, products, transactions, or onboarding status.

2. Update browser page title:

```jsx
import { useEffect, useState } from "react"

function CounterTitle() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

Use case: update browser title based on page name, unread count, selected user, or active workflow.

3. Timer with cleanup:

```jsx
import { useEffect, useState } from "react"

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  return <p>Seconds: {seconds}</p>
}
```

Use case: countdown, session timer, polling timer, or OTP resend timer.

4. Window resize listener with cleanup:

```jsx
import { useEffect, useState } from "react"

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <p>Window width: {width}</p>
}
```

Use case: responsive layout, sidebar behavior, chart resizing, or table layout recalculation.

5. Save preference to localStorage:

```jsx
import { useEffect, useState } from "react"

function ThemePreference() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current theme: {theme}
    </button>
  )
}
```

Use case: save theme, language, filters, or draft form data.

6. Run logic when search value changes:

```jsx
import { useEffect, useState } from "react"

function SearchLogger() {
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!search) return

    console.log("Search changed:", search)
  }, [search])

  return (
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search..."
    />
  )
}
```

Use case: trigger search, analytics, validation, dependent dropdowns, or status checks.

Cleanup example:

```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    console.log("polling")
  }, 1000)

  return () => {
    clearInterval(timerId)
  }
}, [])
```

Pros:

- Keeps side effects separate from render logic.
- Supports cleanup for timers, subscriptions, and event listeners.
- Makes synchronization with external systems predictable.

Cons:

- Easy to misuse for derived state.
- Missing dependencies can create stale bugs.
- Too many effects can make data flow harder to follow.
- Fetching in effects can create loading waterfalls in larger apps.

Strong interview answer:

`useEffect` is for external synchronization, not for normal calculations. If something can be derived from props or state during render, it usually should not be in an effect.

### Additional: Why can't you use an async function directly as a `useEffect` callback?

The callback passed to `useEffect` must return either nothing or a cleanup function.

An `async` function always returns a Promise. React does not expect the effect callback to return a Promise, because React would not know whether that Promise is intended to be cleanup.

Incorrect:

```tsx
useEffect(async () => {
  const response = await fetch('/api/movies')
}, [])
```

Correct:

```tsx
useEffect(() => {
  async function loadMovies() {
    const response = await fetch('/api/movies')
    const data = await response.json()
    console.log(data)
  }

  loadMovies()
}, [])
```

With cleanup:

```tsx
useEffect(() => {
  const controller = new AbortController()

  async function loadMovies() {
    const response = await fetch('/api/movies', {
      signal: controller.signal,
    })
    const data = await response.json()
    console.log(data)
  }

  loadMovies()

  return () => {
    controller.abort()
  }
}, [])
```

Interview summary:

Do not make the effect callback itself `async`. Define and call an async function inside the effect, and return a real cleanup function if needed.

## Rendering And Performance

### 18. What is reconciliation?

Reconciliation is React’s process of comparing the previous UI tree with the next UI tree and deciding what needs to change in the DOM.

React preserves state when the element type and key match. Changing the key or component type can reset state.

### 19. What is the virtual DOM?

The virtual DOM is a lightweight representation of the UI that React uses to calculate updates.

React compares previous and next trees, then commits the necessary changes to the real DOM.

### 20. What causes a React component to re-render?

A component re-renders when its state changes, its parent re-renders, context it consumes changes, or external store subscriptions update.

Re-rendering is not always bad. Optimization should target expensive or unnecessary renders.

### 21. What is `React.memo`?

`React.memo` memoizes a component and skips re-rendering if its props are shallowly equal.

It helps only when props are stable and rendering is expensive enough to justify memoization.

Simple JavaScript example:

```jsx
import React, { useState } from "react"

const Child = React.memo(function Child({ name }) {
  console.log("Child rendered")

  return <h2>Hello, {name}</h2>
})

export default function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("Karteek")

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <button onClick={() => setName("React")}>
        Change Name
      </button>

      <Child name={name} />
    </div>
  )
}
```

What happens:

```text
Click Count button
  |
  v
Parent re-renders
  |
  v
Child does not re-render because name prop did not change

Click Change Name button
  |
  v
Parent re-renders
  |
  v
Child re-renders because name prop changed
```

Interview explanation:

`React.memo` is used to memoize a component. It prevents a child component from re-rendering when its parent re-renders, as long as the child's props have not changed. It is useful for expensive child components, but we should not use it everywhere because memoization also has a cost.

### 22. What are common memoization pitfalls?

Common mistakes include memoizing cheap calculations, passing unstable object/function props to memoized children, and creating stale closures with incorrect dependency arrays.

Memoization has a cost. Measure before optimizing.

### 23. What is `useTransition`?

`useTransition` marks state updates as non-urgent so urgent updates like typing remain responsive.

It does not make expensive code faster. It changes scheduling so React can prioritize urgent interactions.

Simple JavaScript example:

```jsx
import { useState, useTransition } from "react"

const items = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`)

export default function SearchExample() {
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleChange(event) {
    const value = event.target.value

    setInput(value) // urgent: updates input immediately

    startTransition(() => {
      setSearchQuery(value) // non-urgent: updates query used for filtering
    })
  }

  return (
    <div>
      <input
        value={input}
        onChange={handleChange}
        placeholder="Search items..."
      />

      {isPending && <p>Updating results...</p>}

      <ul>
        {filteredItems.slice(0, 10).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

Important clarification:

`setSearchQuery(value)` does not filter directly. It updates the state used by the filtering logic. When `searchQuery` changes, React re-renders the component, and `filteredItems` is recalculated using the new `searchQuery`.

Flow:

```text
User types
   |
   +-- setInput(value)
   |     |
   |     v
   |   urgent update, input changes immediately
   |
   +-- startTransition(() => setSearchQuery(value))
         |
         v
       non-urgent state update
         |
         v
       component re-renders
         |
         v
       filteredItems recalculates
```

Interview explanation:

`useTransition` lets us mark some state updates as non-urgent. In this example, updating the input value is urgent because typing should feel instant. Updating `searchQuery` is non-urgent because it causes the large list filtering work to recalculate during render.

### 24. What is `useDeferredValue`?

`useDeferredValue` gives a deferred version of a value. Expensive UI based on that deferred value can lag behind urgent updates.

It is different from debounce. Debounce waits for a fixed delay; deferred value lets React schedule lower-priority rendering.

Simple JavaScript example:

```jsx
import { useDeferredValue, useState } from "react"

const items = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`)

export default function DeferredSearchExample() {
  const [search, setSearch] = useState("")
  const deferredSearch = useDeferredValue(search)

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(deferredSearch.toLowerCase())
  )

  return (
    <div>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search items..."
      />

      {search !== deferredSearch && <p>Updating results...</p>}

      <ul>
        {filteredItems.slice(0, 10).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

Important point:

```jsx
const deferredSearch = useDeferredValue(search)
```

This does not change `search`. It creates a deferred version of `search`.

Flow:

```text
User types
   |
   v
search updates immediately
   |
   v
input stays responsive
   |
   v
deferredSearch updates slightly later
   |
   v
filteredItems recalculates using deferredSearch
```

Interview explanation:

`useDeferredValue` gives a deferred version of a value. In this example, the input value `search` updates immediately, so typing stays responsive. The expensive list filtering uses `deferredSearch`, which can lag slightly behind. This helps React prioritize urgent UI updates like typing while delaying heavier rendering work.

### Difference between `useTransition` and `useDeferredValue`

Both help keep the UI responsive, but they are used in different places.

Short difference:

```text
useTransition
= defer a state update

useDeferredValue
= defer a value that already changed
```

Use `useTransition` when you control the state update:

```tsx
const [input, setInput] = useState("")
const [query, setQuery] = useState("")
const [isPending, startTransition] = useTransition()

function handleChange(event) {
  const value = event.target.value

  setInput(value) // urgent update

  startTransition(() => {
    setQuery(value) // non-urgent update
  })
}
```

Use `useDeferredValue` when you already have a value but want expensive UI to use a deferred version:

```tsx
const [search, setSearch] = useState("")
const deferredSearch = useDeferredValue(search)

const filteredItems = items.filter((item) =>
  item.includes(deferredSearch),
)
```

Mental model:

```text
useTransition:
User types
  |
  +-- update input now
  +-- transition update query later

useDeferredValue:
User types
  |
  +-- search value updates now
  +-- deferredSearch follows later
```

Interview answer:

`useTransition` marks a state update as non-urgent. `useDeferredValue` defers the rendering impact of a value that has already changed. If I control the state update, I use `useTransition`. If I receive a value as props or already have a state value and want expensive UI to lag behind, I use `useDeferredValue`.

### 25. What are virtualized lists?

Virtualized lists render only the visible rows from a large list instead of rendering every row in the DOM.

This improves performance for large datasets. Production apps often use libraries like `React Virtuoso(Recomended)`,`react-window` or `react-virtual`.

Simple JavaScript example:

```jsx
import { useState } from "react"

const items = Array.from({ length: 10000 }, (_, index) => `Row ${index + 1}`)

const rowHeight = 40
const visibleCount = 10

export default function VirtualizedListExample() {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.floor(scrollTop / rowHeight)
  const endIndex = startIndex + visibleCount
  const visibleItems = items.slice(startIndex, endIndex)

  return (
    <div
      style={{
        height: "400px",
        overflow: "auto",
        border: "1px solid black",
      }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * rowHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index

          return (
            <div
              key={item}
              style={{
                position: "absolute",
                top: actualIndex * rowHeight,
                height: rowHeight,
                left: 0,
                right: 0,
                borderBottom: "1px solid #ddd",
              }}
            >
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

What happens:

```text
Total rows = 10,000

But screen shows only:
Row 1 to Row 10

When user scrolls:
Calculate scrollTop
Calculate startIndex
Render only visible rows
```

Example:

```text
scrollTop = 0
startIndex = 0
visible rows = 0 to 10

scrollTop = 400
startIndex = 10
visible rows = 10 to 20
```

Why it improves performance:

```text
Without virtualization:
Render 10,000 DOM nodes

With virtualization:
Render only around 10 DOM nodes
```

Interview explanation:

Virtualized lists improve performance by rendering only the visible rows instead of rendering the entire dataset. For example, if there are 10,000 rows but only 10 are visible in the viewport, we render only those 10 rows and use absolute positioning to preserve the scroll height. In real projects, we usually use libraries like `react-window`, `react-virtual`, or TanStack Virtual.

React Virtuoso example:

Install:

```bash
npm install react-virtuoso
```

Simple example:

```jsx
import { Virtuoso } from "react-virtuoso"

const users = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
}))

export default function UsersVirtualList() {
  return (
    <Virtuoso
      style={{ height: 400 }}
      data={users}
      itemContent={(index, user) => (
        <div
          style={{
            padding: "12px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
      )}
    />
  )
}
```

What happens:

```text
Total users = 10,000

Without virtualization:
React renders 10,000 DOM rows

With React Virtuoso:
Only visible rows are rendered
Extra rows are rendered as user scrolls
```

Important props:

```jsx
<Virtuoso
  style={{ height: 400 }}
  data={users}
  itemContent={(index, user) => (
    <div>{user.name}</div>
  )}
/>
```

Meaning:

```text
style={{ height: 400 }}
= gives the virtual list a scrollable height

data={users}
= array of items

itemContent
= function that renders each visible row
```

Interview answer:

In a large list, rendering thousands of rows directly can slow down the browser. With React Virtuoso, we pass the full data array, but the library only mounts the rows visible in the scroll viewport. As the user scrolls, it renders the required rows. This keeps the UI responsive even with thousands of records.

Resume-based example:

In a FinTech or banking dashboard, if we need to show thousands of transactions, onboarding records, or audit logs, I would use virtualization with a library like React Virtuoso. It avoids rendering all rows at once and improves page performance.

### Additional: What is a pure component in React?

A pure component renders the same output for the same props and state. It does not cause side effects during render.

In class components, `React.PureComponent` performs a shallow comparison of props and state to avoid unnecessary re-renders.

In function components, the closest equivalent is `React.memo`.

Simple pure component example:

```jsx
function Greeting({ name }) {
  return <h2>Hello, {name}</h2>
}
```

This is pure because:

```text
Same props -> same output
```

Example:

```jsx
<Greeting name="Karteek" />
```

Always returns:

```jsx
<h2>Hello, Karteek</h2>
```

Pure component with `React.memo`:

```jsx
import React from "react"

const Greeting = React.memo(function Greeting({ name }) {
  console.log("Greeting rendered")

  return <h2>Hello, {name}</h2>
})

export default function App() {
  return <Greeting name="Karteek" />
}
```

Important distinction:

Pure rendering means the component output is predictable. Memoization means React may skip rendering if inputs are shallowly equal.

Not pure example:

```jsx
function BadGreeting({ name }) {
  const randomNumber = Math.random()

  return (
    <h2>
      Hello, {name}. Random: {randomNumber}
    </h2>
  )
}
```

This is not pure because:

```text
Same props -> different output
```

Every render may show a different random number.

Another not pure example:

```jsx
// Bad: side effect during render
function BadComponent({ name }) {
  localStorage.setItem("name", name)

  return <h2>Hello, {name}</h2>
}
```

Use effects for side effects:

```jsx
import { useEffect } from "react"

function GoodComponent({ name }) {
  useEffect(() => {
    localStorage.setItem("name", name)
  }, [name])

  return <h2>Hello, {name}</h2>
}
```

Interview explanation:

A pure component returns the same UI for the same props and state and does not cause side effects during render. For example, a `Greeting` component that only renders `Hello, name` is pure. A component that uses `Math.random()` during render or writes to `localStorage` during render is not pure.

### Additional: How would you optimize a React application?

Start by measuring. Use React DevTools Profiler, browser performance tools, Lighthouse, Web Vitals, and bundle analysis.

Optimization areas:

- Avoid unnecessary re-renders with state colocation, `React.memo`, `useMemo`, and `useCallback`.
- Keep state close to where it is used.
- Split code with lazy loading and route-level chunks.
- Virtualize large lists.
- Optimize images and fonts.
- Reduce bundle size and heavy dependencies.
- Avoid expensive calculations during render.
- Use caching for server state.

Example:

```tsx
const filteredUsers = useMemo(() => {
  return users.filter((user) => user.name.includes(query))
}, [users, query])
```

Interview summary:

Do not blindly memoize everything. First measure, then optimize the bottleneck.

### Additional: What happens when you pass a function as a prop to a component?

When you pass a function as a prop, the child component receives a callback it can call later, usually after a user action.

Example:

```tsx
function Parent() {
  function handleSelect(id: number) {
    console.log('Selected', id)
  }

  return <Child onSelect={handleSelect} />
}

function Child({ onSelect }: { onSelect: (id: number) => void }) {
  return <button onClick={() => onSelect(1)}>Select</button>
}
```

Important interview points:

- Passing a function lets a child communicate upward.
- If the function is recreated every render, memoized children may still re-render.
- Use `useCallback` only when stable function identity matters.

Incorrect:

```tsx
<Child onSelect={handleSelect()} />
```

This calls the function immediately during render.

Correct:

```tsx
<Child onSelect={handleSelect} />
```

### Additional: How do you avoid memory leaks in a React application?

Memory leaks often happen when async work, timers, subscriptions, or event listeners keep running after a component unmounts.

Timer cleanup:

```tsx
useEffect(() => {
  const timerId = window.setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => window.clearInterval(timerId)
}, [])
```

Event listener cleanup:

```tsx
useEffect(() => {
  function handleResize() {
    console.log(window.innerWidth)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

API cancellation:

```tsx
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/profile', { signal: controller.signal })

  return () => controller.abort()
}, [])
```

Interview summary:

Clean up anything that outlives the render: timers, subscriptions, event listeners, WebSocket connections, and stale network requests.

### Additional: What is batch update in React?

Batching means React groups multiple state updates together and performs one re-render instead of rendering after every individual update.

This improves performance because React can calculate the final state first and update the UI once.

Example:

```tsx
function handleClick() {
  setCount((count) => count + 1)
  setIsOpen(true)
  setMessage('Updated')
}
```

React can batch these updates into a single render.

In React 18 and newer, automatic batching became broader. React batches updates not only inside React event handlers, but also inside promises, timeouts, native event handlers, and other async callbacks.

Version note:

Automatic batching for more async scenarios was introduced in **React 18** when using the new root API:

```tsx
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(<App />)
```

Before React 18, React usually batched updates inside React event handlers, but not consistently inside async callbacks like `setTimeout`, promises, or native event listeners.

React 17 style behavior:

```tsx
setTimeout(() => {
  setCount((count) => count + 1)
  setFlag(true)
  // React 17: could cause more than one render
}, 1000)
```

React 18+ automatic batching:

```tsx
setTimeout(() => {
  setCount((count) => count + 1)
  setFlag(true)
  // React 18+: batched into one render
}, 1000)
```

Visual:

```text
Multiple state updates
  |
  v
React batches them
  |
  v
One render
  |
  v
One DOM commit
```

Interview summary:

Automatic batching means React groups multiple state updates into a single render for better performance. Broader automatic batching was introduced in React 18.

### Additional: What is a stale update in React?

A stale update happens when a state update uses an old value instead of the latest value.

This commonly happens because state values belong to the render in which they were created.

Simple problem example:

```jsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  )
}
```

You might expect:

```text
0 -> 3
```

But the result is:

```text
0 -> 1
```

Why?

All three updates use the same old value:

```jsx
setCount(0 + 1)
setCount(0 + 1)
setCount(0 + 1)
```

Correct way: functional update.

```jsx
function handleClick() {
  setCount((previousCount) => previousCount + 1)
  setCount((previousCount) => previousCount + 1)
  setCount((previousCount) => previousCount + 1)
}
```

Now the result is:

```text
0 -> 3
```

Flow:

```text
Initial count = 0

1st update:
previousCount = 0 -> 1

2nd update:
previousCount = 1 -> 2

3rd update:
previousCount = 2 -> 3
```

Another common stale example: `setTimeout`.

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setTimeout(() => {
      setCount(count + 1)
    }, 1000)
  }

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  )
}
```

If the user clicks multiple times quickly, the timeout callback may use an older `count`.

Better:

```jsx
setTimeout(() => {
  setCount((previousCount) => previousCount + 1)
}, 1000)
```

Interview answer:

A stale update happens when a state update uses an outdated state value from an older render. This often occurs when we call `setState(count + 1)` multiple times or inside async callbacks like `setTimeout`. The fix is to use the functional updater form, `setCount((prev) => prev + 1)`, because React passes the latest previous state to the updater.

### Additional: What is `ReactDOM.flushSync()`?

`flushSync()` forces React to flush pending updates synchronously so the DOM is updated immediately.

Normally, React batches updates for performance. `flushSync` is an escape hatch for rare cases where you must read from or interact with the updated DOM immediately after a state change.

Import:

```jsx
import { flushSync } from "react-dom"
```

Why it exists:

```jsx
setOpen(true)
console.log(panelRef.current) // DOM may not be updated yet
```

React may not immediately update the DOM after `setOpen(true)` because it batches updates. But sometimes you need the DOM to be updated immediately before doing work like measuring height, scrolling, focusing, or coordinating with a third-party DOM library.

Simple example: scroll to newly added item.

```jsx
import { useRef, useState } from "react"
import { flushSync } from "react-dom"

export default function TodoList() {
  const [todos, setTodos] = useState(["Learn React"])
  const listRef = useRef(null)

  function addTodo() {
    flushSync(() => {
      setTodos((currentTodos) => [
        ...currentTodos,
        `Todo ${currentTodos.length + 1}`,
      ])
    })

    listRef.current.lastElementChild.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <div>
      <button onClick={addTodo}>
        Add Todo
      </button>

      <ul ref={listRef}>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
    </div>
  )
}
```

Without `flushSync`:

```text
setTodos(...)
  |
  v
React may batch update
  |
  v
DOM may not have new <li> yet
  |
  v
scrollIntoView may target old last item
```

With `flushSync`:

```text
flushSync(() => setTodos(...))
  |
  v
React updates DOM immediately
  |
  v
new <li> exists in DOM
  |
  v
scrollIntoView works on new item
```

Use it sparingly. Overusing `flushSync` hurts React's scheduling and batching benefits.

Bad usage:

```jsx
flushSync(() => {
  setCount(count + 1)
})
```

For normal state updates, this is unnecessary because React batching improves performance.

Use rarely when you must:

```text
update state
then immediately read or use updated DOM
```

Examples:

- scroll to newly added item
- focus newly shown input
- measure newly rendered element
- coordinate with third-party DOM library

Interview answer:

`flushSync` is an escape hatch from React DOM. It forces React to flush state updates synchronously so the DOM is updated immediately. Normally React batches updates for performance, but in rare cases we need the updated DOM right away, such as scrolling to a newly added item or measuring an element after it appears. It should be used sparingly because it bypasses React's normal scheduling and can hurt performance if overused.

## Forms

### 26. What is a controlled component?

A controlled component is an input whose value is controlled by React state.

It uses `value` and `onChange`. Controlled forms are predictable and good for validation, conditional UI, and formatting.

Simple example:

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

export default ControlledInputExample
```

Why this is controlled:

```jsx
value={name}
```

The input value comes from React state.

```jsx
onChange={(event) => setName(event.target.value)}
```

Every input change updates React state.

Flow:

```text
User types in input
   |
   v
onChange runs
   |
   v
setName updates React state
   |
   v
component re-renders
   |
   v
input displays latest name from state
```

Why controlled components are useful:

- easy validation
- conditionally disable submit button
- format input while typing
- show error messages
- reset form using state
- submit exact state values

Example with validation:

```jsx
import { useState } from "react"

function ControlledFormExample() {
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
        <p style={{ color: "red" }}>Please enter a valid email</p>
      )}

      <button disabled={!isValidEmail}>
        Submit
      </button>
    </form>
  )
}
```

Interview explanation:

A controlled component is a form element whose value is managed by React state. The input gets its value from state using the `value` prop, and user changes are handled through `onChange`, which updates the state. This makes React the single source of truth for the form value.

Interview line:

I use controlled components when I need validation, conditional UI, formatting, or predictable form submission because React state always has the latest form value.

### 27. What is an uncontrolled component?

An uncontrolled component stores its value in the DOM. React reads the value when needed, usually through a ref.

File inputs are commonly uncontrolled because browsers restrict programmatic control for security.

Simple uncontrolled input example:

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

      <button type="submit">
        Submit
      </button>
    </form>
  )
}
```

Why this is uncontrolled:

```text
React does not control the input with value + onChange.
The DOM stores the latest value.
React reads the value only when needed through ref.
```

Flow:

```text
User types in input
   |
   v
DOM stores latest value
   |
   v
User submits form
   |
   v
React reads value from ref
```

Use `defaultValue` instead of `value` when you want an initial value but do not want React to control every change.

### File uploads in real projects like POI and POA

For POI/POA file uploads, the basic uncontrolled file input pattern is correct:

```jsx
<input type="file" ref={fileRef} />
```

File inputs are commonly uncontrolled because browsers restrict programmatic control of file values for security.

However, in real projects like Stablehouse POI/POA document upload, we usually add production-level handling around the input.

Simple real-project style example:

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
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Document"}
      </button>
    </div>
  )
}
```

Common real-project upload approaches:

```text
1. REST API with FormData
2. GraphQL multipart upload
3. Pre-signed URL upload
```

REST API with `FormData`:

```jsx
const formData = new FormData()
formData.append("document", file)
formData.append("documentType", "POI")

fetch("/api/documents/upload", {
  method: "POST",
  body: formData,
})
```

GraphQL multipart upload:

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
Returns upload status or document ID
```

Pre-signed URL upload:

```text
React asks backend for upload URL
   |
   v
Backend returns signed S3/Azure URL
   |
   v
React uploads file directly to storage
   |
   v
React notifies backend upload completed
```

Frontend responsibilities:

- file type validation
- file size validation
- selected file name or preview
- upload progress
- loading, error, and retry states
- disable submit while uploading
- accessible error messages

Backend/security responsibilities:

- validate file type again
- validate file size again
- authenticate and authorize the user
- virus or malware scanning
- secure storage
- signed URLs for cloud storage when needed

Resume-based interview answer:

In my Stablehouse onboarding project, POI and POA uploads involved selecting identity or address documents from the UI, validating file type and size, showing selected file details, handling loading and error states, and submitting the file metadata or upload request to backend APIs. Depending on backend design, this can be implemented using REST `FormData`, GraphQL multipart upload, or pre-signed URL upload. For security, backend validation, authentication, authorization, file scanning, and secure storage are also important.

### 28. How do you handle form validation?

Form validation can be derived from state, handled on submit, or managed with schema libraries like Zod or Yup.

Frontend validation improves user experience, but backend validation is required for security and data integrity.

### 29. What is React Hook Form?

React Hook Form is a form library built around uncontrolled inputs, registration, validation, and efficient form state subscriptions.

It is useful for large production forms because it reduces boilerplate and avoids unnecessary re-renders.

### 30. How do multi-step forms work?

Multi-step forms store current step and form values in a shared parent, reducer, or form provider.

Usually each step validates before moving forward. The final step often reviews all collected values.

## Data Fetching

### 31. How do you fetch data in React?

For simple component-level fetching, use `useEffect` with loading, error, empty, and success states.

In production apps, use data fetching libraries or framework loaders when caching, retries, invalidation, and stale data matter.

### 32. What states should API UI handle?

A strong API UI handles loading, success, empty, error, and sometimes refreshing or stale states.

Only handling success is a common interview red flag.

### 33. What is AbortController used for?

`AbortController` cancels fetch requests or abortable async work.

Use it when a component unmounts or a newer request makes an older request stale.

### 34. What is server state vs client state?

Server state is remote data owned by the backend. It is asynchronous, shared, cacheable, and can become stale.

Client state is local UI state, such as selected tab, modal open state, form draft, or filter selection.

### 35. What is React Query / TanStack Query?

TanStack Query manages server state: fetching, caching, retries, stale data, background refetching, mutations, and invalidation.

It helps avoid manually rebuilding server-state logic in every component.

### 36. What is optimistic UI?

Optimistic UI updates the interface before the server confirms success.

If the request succeeds, the optimistic change is confirmed. If it fails, the UI rolls back or marks the item as failed.

## Routing

### 37. What is client-side routing?

Client-side routing changes the rendered React screen based on the URL without loading a new HTML document from the server.

React Router is commonly used for routes, links, params, nested routes, and redirects.

### 38. What is `useParams`?

`useParams` reads dynamic path values from the URL, such as `/movies/:movieId`.

It is commonly used in detail pages.

### 39. What are search params?

Search params store URL query values like `?page=2&type=frontend`.

They are useful for shareable filters, search terms, sorting, tabs, and pagination.

### 40. What are protected routes?

Protected routes restrict access to private screens and redirect unauthenticated users.

Frontend route guards improve user experience, but backend APIs must still enforce authentication and authorization.

## Architecture And Patterns

### 41. What is lifting state up?

Lifting state up means moving shared state to the closest common parent so sibling components can stay in sync.

Do not lift state higher than necessary.

### 42. What is state colocation?

State colocation means keeping state close to the component that uses it.

Start local, then lift state only when sharing is needed.

### 43. What is Context API?

Context lets components access shared values without passing props through every intermediate level.

It is useful for app-level values such as theme, auth user, locale, or feature flags. Avoid putting every local state value in context.

### 44. What are compound components?

Compound components are related components that work together through shared state, often via context.

Examples include Tabs, Accordion, Menu, and Select APIs.

### 45. What are render props?

Render props share behavior by passing a function that receives state or helpers and returns UI.

Hooks replaced many render-prop use cases, but the pattern is still useful to understand.

### 46. What is a higher-order component?

A higher-order component is a function that takes a component and returns a new enhanced component.

HOCs were common before hooks and still appear in legacy code and some libraries.

### Additional: How would you handle state management for backend data, authentication, and global settings?

Use different tools for different kinds of state.

Backend data:

Use a server-state library like TanStack Query, SWR, RTK Query, Apollo Client, or framework loaders. Backend data needs loading, error, caching, retries, stale data handling, and invalidation.

Authentication:

Use an auth provider or app-level store that represents states like `loading`, `guest`, and `authenticated`. The backend must enforce security. The frontend auth state is mainly for UI and routing decisions.

Global settings:

Use Context or a small global store for values like theme, locale, feature flags, and app preferences.

Simple mental model:

```text
State Type          Good Tool
-----------------   -----------------------------
Server data         TanStack Query / route loaders
Auth session        Auth provider / secure backend
Theme, locale       Context or small global store
Form draft          Local state / form library
URL filters         Search params
```

Interview summary:

Do not put every kind of state into one global store. Separate server state, auth state, UI state, and URL state.

### Additional: What is the difference between essential and derived state?

Essential state is the minimum source of truth your app needs to store.

Derived state is calculated from existing props or state.

Example:

```tsx
const [items, setItems] = useState(products)
const [query, setQuery] = useState('')

const filteredItems = items.filter((item) =>
  item.name.toLowerCase().includes(query.toLowerCase()),
)
```

Here, `items` and `query` are essential state. `filteredItems` is derived state.

Avoid this:

```tsx
const [filteredItems, setFilteredItems] = useState([])
```

This duplicates data and can become inconsistent.

Interview summary:

Store the minimum state needed. Calculate derived values during render or with `useMemo` if the calculation is expensive.

### Additional: What are the disadvantages of using React Context for state management?

Context is useful, but it is not a complete state management solution for every case.

Disadvantages:

- Any consumer can re-render when the context value changes.
- Frequent updates can hurt performance if the provider is high in the tree.
- Complex update logic can become messy.
- It lacks built-in devtools, middleware, time travel, caching, and server-state features.
- Large context values can couple unrelated parts of the app.

Example problem:

```tsx
<AppContext.Provider value={{ user, theme, cart, notifications }}>
  <App />
</AppContext.Provider>
```

If `notifications` changes frequently, unrelated consumers may also be affected depending on how the context is structured.

Better approach:

- Split contexts by concern.
- Keep high-frequency state local when possible.
- Use server-state libraries for backend data.
- Use Redux, Zustand, Jotai, or another store when global client state becomes complex.

### Additional: When would you use Context API and when would you choose Redux? Why?

Use Context when:

- Data changes infrequently.
- Many nested components need the same value.
- The state is simple, like theme, locale, current user, or feature flags.

Use Redux or another state library when:

- Many unrelated components update shared state.
- State transitions are complex.
- You need devtools, middleware, persistence, undo/redo, or predictable action logs.
- A team needs a strict shared pattern.

Important note:

Redux is not usually the best tool for server data anymore. For backend data, a query library like TanStack Query is often better because it handles caching, invalidation, retries, and stale data.

Interview summary:

Context is great for dependency injection and low-frequency global values. Redux is better for complex shared client state with predictable update flows and tooling.

## Security

### 47. How does React help prevent XSS?

React escapes string values by default, so text like `<script>` is rendered as text, not executed.

XSS risk still exists if you use `dangerouslySetInnerHTML`, unsafe URLs, or render untrusted HTML without sanitization.

### 48. What is CSRF?

CSRF tricks a browser into sending authenticated requests to another site.

It is especially relevant for cookie-based auth because browsers automatically send matching cookies. Common protections include SameSite cookies, CSRF tokens, and server-side origin checks.

### 49. Are frontend route guards enough for security?

No. Frontend guards only control the UI. Backend APIs must enforce authorization because frontend code can be bypassed.

### 50. Can frontend environment variables store secrets?

No. Frontend environment variables are bundled into browser JavaScript and can be inspected.

Secrets must stay on the server.

## Testing And Quality

### 51. What should you test in React components?

Test user-visible behavior: rendering, interactions, validation, loading states, error states, and important callbacks.

Avoid testing implementation details like internal state variable names.

### 52. What is the difference between unit, integration, and E2E testing?

Unit tests check small isolated logic. Integration tests check multiple pieces working together. E2E tests validate full user flows in a real browser.

Use E2E for critical flows like login, checkout, onboarding, or high-value CRUD paths.

### 53. What is MSW?

Mock Service Worker mocks network requests at the request layer.

It lets tests and local development use realistic API behavior without depending on a real backend.

### 54. What is Storybook?

Storybook lets teams develop, document, and test UI components in isolated states.

It is especially useful for design systems, component documentation, and visual regression testing.

### Additional: How would you approach testing a mid-sized React application with no existing tests?

Start with risk and business value. Do not try to test everything at once.

Step-by-step approach:

1. Identify critical user flows: login, checkout, dashboard, profile update, important forms.
2. Add smoke E2E tests for the highest-value flows.
3. Add integration/component tests for complex components and forms.
4. Add unit tests for pure utility functions and reducers.
5. Mock API boundaries with MSW or test fixtures.
6. Add tests gradually whenever bugs are fixed or features are changed.

Testing pyramid:

```text
        E2E tests
      /-----------\
     Integration tests
   /-------------------\
  Unit tests and pure logic
```

Interview summary:

For an untested mid-sized app, begin with critical flows and regression-prone areas. Build confidence gradually instead of chasing 100% coverage immediately.

### Additional: How do you balance unit, integration, and end-to-end tests?

Use each test type for what it is best at.

Unit tests:

Best for pure functions, reducers, validators, formatters, and small logic.

Integration/component tests:

Best for React components working with hooks, forms, state, and user interactions.

E2E tests:

Best for critical flows through the real app in a browser.

Practical balance:

```text
Unit tests        Many, fast, focused
Integration       Some, behavior-focused
E2E               Few, critical user journeys
```

Strong interview answer:

I prefer more unit and integration tests because they are faster and easier to maintain, plus a smaller number of E2E tests for the most important user journeys.

### Additional: What is code coverage and what is an appropriate target for frontend applications?

Code coverage measures how much of the code was executed while tests ran.

Common coverage types:

- Line coverage: which lines ran.
- Branch coverage: which `if/else` branches ran.
- Function coverage: which functions ran.
- Statement coverage: which statements ran.

Coverage is useful, but high coverage does not guarantee good tests. A test can execute code without making meaningful assertions.

Appropriate frontend target:

For many teams, 70-80% meaningful coverage is a healthy target. Critical business logic, reducers, utilities, and high-risk flows should have stronger coverage. UI-only or low-risk code may not need exhaustive coverage.

Interview summary:

Coverage is a signal, not the goal. I care more about meaningful tests for important behavior than hitting 100% coverage with weak assertions.

### Additional: Do you write unit test cases?

Yes. Unit tests are useful for small pieces of logic that can be tested independently.

Good unit test targets:

- Utility functions.
- Reducers.
- Validators.
- Formatters.
- Data transformation functions.
- Custom hooks with isolated behavior.

Example:

```tsx
function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim()
}
```

This is a good unit test candidate because it is pure and easy to verify.

### Additional: Where do you write unit test cases in a React application?

Common patterns:

```text
src/
  utils/
    formatDate.ts
    formatDate.test.ts

  components/
    UserCard.tsx
    UserCard.test.tsx
```

or:

```text
src/
  __tests__/
    formatDate.test.ts
    UserCard.test.tsx
```

Best practice:

Keep tests close to the code when it improves maintainability. Use a consistent project convention.

### Additional: How do you handle errors in React?

In React, error handling depends on where the error happens. A strong interview answer should mention multiple layers:

- Render errors: use Error Boundaries.
- Event handler errors: use `try/catch`.
- Async/API errors: use loading/error state or a data-fetching library.
- Form validation errors: show field-level messages.
- Production errors: report to monitoring tools.

#### 1. Handling render errors with Error Boundaries

Error Boundaries catch errors while rendering child components. They prevent the whole app from crashing and show fallback UI.

Example:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Report error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please try again.</p>
    }

    return this.props.children
  }
}
```

Usage:

```tsx
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

Important interview point:

Error Boundaries catch render-time errors in child components. They do not catch errors inside event handlers, async callbacks, promises, or server-side rendering.

#### 2. Handling event handler errors

Errors inside event handlers should be handled with normal `try/catch`.

Example:

```tsx
function SaveButton() {
  const [error, setError] = useState('')

  function handleSave() {
    try {
      throw new Error('Save failed')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <>
      <button onClick={handleSave}>Save</button>
      {error && <p role="alert">{error}</p>}
    </>
  )
}
```

#### 3. Handling API errors

For API calls, keep explicit request states: loading, success, empty, and error.

Example:

```tsx
function Movies() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load movies')
        }

        return response.json()
      })
      .then(() => setStatus('success'))
      .catch((error: Error) => {
        setError(error.message)
        setStatus('error')
      })
  }, [])

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'error') return <p role="alert">{error}</p>

  return <p>Movies loaded.</p>
}
```

In production, libraries like TanStack Query can manage error states, retries, stale data, and refetching.

Note about `role="alert"`:

`role="alert"` is an accessibility attribute. It tells assistive technologies like screen readers that the message is important and should be announced immediately when it appears.

Use it for important dynamic messages such as validation errors, failed API requests, or payment failures:

```tsx
{error && <p role="alert">{error}</p>}
```

Without `role="alert"`, the error may appear visually, but a screen reader user may not know that new error content was added to the page.

#### 4. Handling form errors

Form errors should usually be shown near the relevant field.

Example:

```tsx
function LoginForm() {
  const [email, setEmail] = useState('')
  const emailError = email && !email.includes('@') ? 'Enter a valid email.' : ''

  return (
    <label>
      Email
      <input value={email} onChange={(event) => setEmail(event.target.value)} />
      {emailError && <span role="alert">{emailError}</span>}
    </label>
  )
}
```

#### 5. Production error handling

In real projects, error handling usually includes:

- Error Boundaries around routes or major sections.
- Friendly fallback UI for users.
- Logging/reporting with tools like Sentry, Datadog, New Relic, or application monitoring.
- Retry options for recoverable errors.
- Avoiding raw technical stack traces in the UI.

Strong interview summary:

React error handling is layered. Use Error Boundaries for render errors, `try/catch` for event handlers, request state for API errors, field-level messages for forms, and monitoring tools for production reporting.

## Tooling And Webpack

### Additional: What is the purpose of Webpack?

Webpack is a module bundler. Its main purpose is to take many files from an application, understand their dependencies, transform them if needed, and produce optimized bundles for the browser.

Webpack can process:

- JavaScript and TypeScript.
- CSS and preprocessors.
- Images and fonts.
- Code-split chunks.
- Environment-specific builds.

Simple mental flow:

```text
Source files
    |
    v
Webpack reads imports
    |
    v
Builds dependency graph
    |
    v
Applies loaders/plugins
    |
    v
Outputs optimized bundles
```

Example:

```tsx
import App from './App'
import './styles.css'
import logo from './logo.png'
```

Webpack follows these imports, processes each file with the right loader, and includes the needed output in the build.

Interview summary:

Webpack turns a project's module graph into optimized browser-ready assets.

### Additional: What is tree shaking and how does it work in Webpack?

Tree shaking removes unused code from the final bundle.

It works best with ES modules because `import` and `export` statements are statically analyzable.

Example:

```ts
// math.ts
export function add(a: number, b: number) {
  return a + b
}

export function multiply(a: number, b: number) {
  return a * b
}
```

```ts
// app.ts
import { add } from './math'

console.log(add(1, 2))
```

If `multiply` is never imported or used, Webpack can mark it as unused and remove it during production optimization.

Important conditions:

- Use ES modules.
- Avoid unnecessary side effects.
- Use production mode.
- Libraries should correctly mark side-effect-free files with `sideEffects: false` when appropriate.

Interview summary:

Tree shaking reduces bundle size by removing unused exports. It depends on static imports, production optimization, and safe side-effect analysis.

### Additional: What is a dependency graph in Webpack?

A dependency graph is Webpack's map of all modules and how they depend on each other.

Webpack starts from one or more entry files, follows every `import` or `require`, and builds a graph of connected modules.

Diagram:

```text
main.tsx
  |
  +-- App.tsx
  |     |
  |     +-- Header.tsx
  |     +-- MovieList.tsx
  |            |
  |            +-- MovieCard.tsx
  |
  +-- index.css
```

Webpack uses this graph to decide:

- What code belongs in the bundle.
- Which files depend on which other files.
- Where code splitting can happen.
- Which modules may be unused.
- How assets should be emitted.

Interview summary:

The dependency graph is the structure Webpack builds by following imports from the entry point. Bundling, code splitting, and tree shaking all depend on this graph.

## Production And Ecosystem

### 55. What is SSR vs CSR vs SSG?

CSR renders in the browser after JavaScript loads. SSR renders HTML on the server per request. SSG generates HTML at build time.

The right choice depends on SEO, freshness, personalization, performance, and hosting needs.

### 56. What is hydration?

Hydration is when React attaches event handlers and interactivity to server-rendered HTML.

Hydration mismatches happen when server-rendered markup differs from the client’s first render.

### 57. What are React Server Components?

React Server Components render on the server and do not ship their component JavaScript to the browser.

They are useful for data-heavy, non-interactive UI. Client Components are still needed for state, effects, and event handlers.

### 58. What is code splitting?

Code splitting breaks JavaScript into smaller chunks so the app does not load everything upfront.

React supports lazy-loaded components with `React.lazy` and `Suspense`.

### 59. What are Web Vitals?

Web Vitals are user-centered performance metrics.

Important metrics include LCP for loading, INP for responsiveness, and CLS for visual stability.

### 60. What is bundle analysis?

Bundle analysis inspects the JavaScript and CSS shipped to users.

It helps identify large dependencies, duplicate packages, missing code splitting, and unused code.

### Additional: React 17 vs React 18 vs React 19?

React 17 was mainly a gradual-upgrade release. It did not introduce many new developer-facing features, but it changed event delegation so React attaches events to the root container instead of `document`. This made it easier to run multiple React versions on the same page during migrations.

React 18 introduced concurrent rendering capabilities and major modern features:

- `createRoot`
- automatic batching for more async updates
- `useTransition`
- `useDeferredValue`
- improved Suspense support
- streaming server rendering APIs

React 19 continues the modern React direction with improvements around actions, form-related APIs, optimistic UI, `use`, refs as props, and better support for Server Components in frameworks. Exact usage depends on the framework and setup, but the interview-level idea is that React 19 improves async workflows, forms, and server/client integration.

Detailed comparison:

```text
React 17
  |
  +-- Gradual upgrade release
  +-- Event delegation moved from document to root container
  +-- Easier to embed multiple React versions
  +-- No major new component APIs

React 18
  |
  +-- createRoot API
  +-- Concurrent rendering foundation
  +-- Automatic batching for async updates
  +-- useTransition
  +-- useDeferredValue
  +-- Improved Suspense support
  +-- Streaming SSR support

React 19
  |
  +-- Better async/action workflows
  +-- Form actions and related improvements
  +-- useActionState / useFormStatus style workflows
  +-- useOptimistic
  +-- ref as prop improvements
  +-- Better Server Component integration in frameworks
```

Version migration mental model:

```text
React 17
  |
  v
Safer upgrade path
  |
  v
React 18
  |
  v
Concurrent rendering + automatic batching
  |
  v
React 19
  |
  v
Modern async, forms, optimistic UI, server integration
```

Interview answer:

React 17 was mainly about smoother upgrades and event delegation changes. React 18 introduced the concurrent rendering foundation, `createRoot`, automatic batching, and hooks like `useTransition` and `useDeferredValue`. React 19 improves modern async workflows, form actions, optimistic UI, and server/client integration, especially when used with frameworks.

Strong interview summary:

React 17 was about easier upgrades. React 18 was about concurrent rendering and automatic batching. React 19 improves modern async, form, and server-component workflows.

### Additional: What is concurrent loading or concurrent rendering?

Interviewers may say "concurrent loading", but in React the common official idea is **concurrent rendering**.

Concurrent rendering means React can prepare a new UI update in the background without blocking urgent user interactions.

It does not mean React runs your JavaScript on multiple threads. It means React can pause, interrupt, resume, or discard rendering work based on priority.

Simple example:

```text
User types in input
  |
  v
Urgent update: show typed character immediately
  |
  v
Non-urgent update: filter large result list
  |
  v
React can delay list rendering so typing stays responsive
```

Without concurrent rendering:

```text
User types
  |
  v
Expensive list render blocks UI
  |
  v
Input feels slow
```

With concurrent rendering:

```text
User types
  |
  +-- Urgent input update happens quickly
  |
  +-- Expensive list update can be scheduled as non-urgent
```

Example with `useTransition`:

```tsx
function SearchPage() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value

    setInput(nextValue)

    startTransition(() => {
      setQuery(nextValue)
    })
  }

  const results = expensiveFilter(query)

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <p>Updating results...</p>}
      <ResultsList results={results} />
    </>
  )
}
```

What happens:

```text
setInput(nextValue)
  |
  v
Urgent update: input stays responsive

startTransition(() => setQuery(nextValue))
  |
  v
Non-urgent update: result list can render later
```

Another example with Suspense and lazy loading:

```tsx
const ReportsPage = lazy(() => import('./ReportsPage'))

function App() {
  return (
    <Suspense fallback={<p>Loading reports...</p>}>
      <ReportsPage />
    </Suspense>
  )
}
```

This is code loading, not the same thing as concurrent rendering. But in React 18+, Suspense and concurrent features work together better to keep the UI responsive while parts of the app are waiting.

Important distinction:

```text
Lazy loading
  |
  v
Load JavaScript only when needed

Concurrent rendering
  |
  v
Schedule rendering work by priority
```

Resume-based example:

In HNB Digital Lobby, if a user types in a search field and the app filters a large customer or transaction list, `useTransition` could keep typing responsive while the heavier list update is treated as non-urgent.

Interview summary:

Concurrent rendering is React's ability to prepare UI updates without blocking urgent interactions. It was introduced as a major foundation in React 18. We use APIs like `useTransition` and `useDeferredValue` to keep typing, clicking, and navigation responsive while heavier UI updates happen with lower priority.

## Architecture Interview Topics

### How would you design a scalable React application?

A scalable React application should be organized around clear boundaries: features, shared UI, API services, state management, routing, testing, and build/deployment.

A good high-level structure:

```text
src/
  app/
    routes/
    providers/
    store/

  features/
    onboarding/
      components/
      hooks/
      api/
      types/
      tests/

    payments/
      components/
      hooks/
      api/
      types/

  shared/
    components/
    hooks/
    utils/
    constants/
    types/

  services/
    httpClient.ts
    graphqlClient.ts

  assets/
  styles/
```

Architecture diagram:

```text
React App
  |
  +-- App Providers
  |     +-- Auth Provider
  |     +-- Theme Provider
  |     +-- Query/Redux Provider
  |
  +-- Routes
  |     +-- Feature Pages
  |
  +-- Features
  |     +-- Components
  |     +-- Hooks
  |     +-- API layer
  |     +-- Types
  |
  +-- Shared UI and Utils
```

Key principles:

- Feature-based folders scale better than dumping everything into `components`.
- Shared components should be reusable and business-agnostic.
- API calls should be isolated from UI components.
- Server state and client UI state should be managed separately.
- Types should be explicit, especially in TypeScript apps.
- Tests should live near important features.
- Performance should be measured with DevTools, React Profiler, bundle analysis, and Web Vitals.

Example from your resume:

For the XBTO Stablehouse onboarding platform, a scalable architecture could organize POI, POA, Investor Type, Account Type, and Liveness Verification as separate feature modules:

```text
features/
  onboarding/
    poi/
    poa/
    investor-type/
    account-type/
    liveness/
    shared/
      DocumentUpload.tsx
      VerificationStatus.tsx
      onboardingApi.ts
      onboardingTypes.ts
```

This helps because each onboarding step has its own UI, validation, API submission, and test cases, while common pieces like document upload and verification status remain reusable.

Interview answer:

I would design a scalable React app using feature-based architecture, shared reusable components, a centralized API layer, clear state boundaries, route-level code splitting, TypeScript types, and automated testing. In my Stablehouse onboarding work, this kind of structure fits well because workflows like POI, POA, account type, and liveness verification can be maintained independently while sharing common upload and validation components.

### How would you architect an enterprise application?

An enterprise React application needs more than components. It needs maintainability, consistency, security, observability, performance, and team scalability.

Important enterprise architecture areas:

```text
Enterprise React Architecture
  |
  +-- UI architecture
  |     +-- Design system
  |     +-- Shared components
  |     +-- Accessibility
  |
  +-- Application architecture
  |     +-- Feature modules
  |     +-- Routing
  |     +-- State management
  |     +-- API layer
  |
  +-- Quality
  |     +-- Unit tests
  |     +-- Integration tests
  |     +-- E2E tests
  |     +-- Code reviews
  |
  +-- Delivery
        +-- CI/CD
        +-- SonarQube
        +-- Build optimization
        +-- Monitoring
```

For enterprise apps, I would focus on:

- A design system or shared component library.
- TypeScript for safer contracts.
- Consistent API clients for REST and GraphQL.
- Centralized auth and permission handling.
- Error boundaries around major routes.
- Feature flags for safe releases.
- Accessibility standards such as WCAG.
- CI/CD pipelines for lint, test, build, and deployment.
- Code splitting and lazy loading for large modules.
- PR reviews and static analysis tools like SonarQube.

Centralized auth and permission handling explanation:

Centralized auth means the application has one clear place responsible for knowing:

- Is the user logged in?
- Who is the current user?
- What roles or permissions does the user have?
- Is the session still valid?
- Which routes or actions can the user access?

Instead of checking authentication separately in every component, we create a common auth layer such as `AuthProvider`, `useAuth`, `ProtectedRoute`, and permission helper functions.

Visual diagram:

```text
App starts
  |
  v
AuthProvider checks session
  |
  +-- loading -----------------> Show loading screen
  |
  +-- no valid session --------> Guest user / Login page
  |
  +-- valid session -----------> Store user + permissions
                                  |
                                  v
                           Protected routes
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
             Permission checks            API requests
                    |                           |
                    v                           v
        Show/hide UI actions          Backend validates access
```

Basic auth state model:

```ts
type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; user: User; permissions: string[] }
```

Example:

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth()

  if (authState.status === 'loading') {
    return <p>Checking session...</p>
  }

  if (authState.status === 'guest') {
    return <Navigate to="/login" replace />
  }

  return children
}
```

Permission helper example:

```ts
function hasPermission(userPermissions: string[], permission: string) {
  return userPermissions.includes(permission)
}
```

Usage in UI:

```tsx
function DocumentActions() {
  const { authState } = useAuth()

  if (authState.status !== 'authenticated') {
    return null
  }

  const canUploadDocument = hasPermission(
    authState.permissions,
    'document:upload',
  )

  return (
    <>
      {canUploadDocument && <button>Upload document</button>}
    </>
  )
}
```

Important security point:

Frontend permission checks are for user experience. They hide or show screens and buttons, but they are not the real security layer. The backend must still validate every sensitive API request.

Resume-based example:

For the XBTO Stablehouse onboarding platform, centralized auth and permission handling would be important because users may have access to different onboarding steps such as POI, POA, Investor Type, Account Type, and Liveness Verification.

Example:

```text
Authenticated user
  |
  v
Load onboarding status + permissions
  |
  +-- can submit POI -----------> Show POI upload step
  |
  +-- can submit POA -----------> Show POA upload step
  |
  +-- liveness required --------> Show Liveness Verification
  |
  +-- onboarding complete ------> Redirect to dashboard
```

In this type of FinTech onboarding flow, the frontend can guide the user through the correct screens, but the backend must still verify that the user is allowed to upload documents, submit identity information, or access account-specific data.

Interview summary:

Centralized auth and permission handling means authentication, session restoration, protected routes, roles, and permissions are managed in one consistent layer instead of being scattered across components. In enterprise and FinTech applications like Stablehouse onboarding, this keeps sensitive flows easier to maintain and safer because UI access is consistent and backend APIs still enforce real authorization.

Feature flags explanation:

Feature flags let teams turn a feature on or off using configuration without deploying new code. This separates deployment from release.

Instead of releasing a feature to everyone immediately, the team can deploy the code but keep it hidden until it is ready.

Example:

```tsx
const featureFlags = {
  newOnboardingFlow: true,
  betaDashboard: false,
}

function App() {
  return featureFlags.newOnboardingFlow ? (
    <NewOnboardingFlow />
  ) : (
    <OldOnboardingFlow />
  )
}
```

Safe release flow:

```text
Deploy code first
  |
  v
Enable feature for internal users
  |
  v
Enable for a small percentage of users
  |
  v
Monitor errors and performance
  |
  v
Enable for everyone or turn off quickly if something breaks
```

Resume-based example:

For the Stablehouse onboarding flow, suppose a new Liveness Verification screen is being released. Instead of enabling it for all users immediately, it can be placed behind a feature flag:

```tsx
if (flags.enableLivenessVerification) {
  return <LivenessVerification />
}

return <ManualVerification />
```

This is safer because QA can test it in production-like environments, product can release it to selected users, and the team can disable it quickly if document upload or verification has issues.

Interview summary:

Feature flags help separate deployment from release. We can deploy code safely, enable it gradually, monitor behavior, and disable it quickly if issues occur. This is especially useful in enterprise apps and high-risk flows like onboarding, payments, or identity verification.

Example from your resume:

In HNB Digital Lobby, you migrated an Angular application to React and improved maintainability and page load speed. That is a strong enterprise architecture example. You can explain it like this:

I helped migrate a Digital Lobby application from Angular to React by creating reusable components, shared frontend libraries, API integration patterns, and state management using hooks, Context API, and Redux. We also optimized page load time with lazy loading and React Profiler-based improvements, and used Jenkins CI/CD for reliable build, test, and deployment workflows.

Strong interview answer:

For an enterprise application, I would separate the app into feature modules, shared UI libraries, typed API layers, centralized auth, and clear state management. I would also include quality gates like Jest, React Testing Library, PR reviews, SonarQube, and CI/CD. From my HNB Digital Lobby experience, this approach helped during Angular-to-React migration, improved maintainability, and reduced page load time.

### How do you organize APIs in a React application?

API logic should not be scattered inside UI components. A scalable app should have a dedicated API layer.

Recommended structure:

```text
features/
  onboarding/
    api/
      onboardingApi.ts
      onboardingQueries.ts
      onboardingMutations.ts
    types/
      onboardingTypes.ts

services/
  httpClient.ts
  graphqlClient.ts
  authInterceptor.ts
```

For REST APIs:

```ts
// services/httpClient.ts
import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
```

```ts
// features/payments/api/paymentApi.ts
import { httpClient } from '../../../services/httpClient'

export function getPaymentMethods() {
  return httpClient.get('/payment-methods')
}
```

For GraphQL APIs:

```ts
export async function submitOnboardingDocument(input: DocumentInput) {
  return graphqlClient.request(SUBMIT_DOCUMENT_MUTATION, { input })
}
```

Best practices:

- Keep API calls out of presentational components.
- Create typed request and response models.
- Centralize auth headers and error handling.
- Use AbortController or query libraries for stale requests.
- Use TanStack Query, RTK Query, Apollo Client, or framework loaders for server state.
- Keep REST and GraphQL clients consistent.

Stale requests explanation:

A stale request is an older API request that finishes after a newer request and tries to update the UI with outdated data.

This commonly happens in search, filters, typeahead, route changes, and fast navigation.

Visual diagram:

```text
User searches "re"
  |
  v
Request A starts ----------------------+
                                      |
User quickly searches "react"          |
  |                                   |
  v                                   |
Request B starts --------+             |
                         |             |
Request B finishes first |             |
  |                      |             |
  v                      |             |
UI shows "react" results |             |
                         |             |
Request A finishes later <-------------+
  |
  v
Problem: old "re" results may overwrite "react" results
```

There are two common ways to handle this:

1. Cancel the old request with `AbortController`.
2. Use a query library that handles stale requests, caching, and race conditions.

AbortController example:

```tsx
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) return

    const controller = new AbortController()

    async function loadResults() {
      try {
        const response = await fetch(`/api/search?q=${query}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load results')
        }

        const data = await response.json()
        setResults(data)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    loadResults()

    return () => {
      controller.abort()
    }
  }, [query])

  if (error) return <p role="alert">{error}</p>

  return (
    <ul>
      {results.map((result) => (
        <li key={result}>{result}</li>
      ))}
    </ul>
  )
}
```

What happens here:

```text
query changes
  |
  v
React runs cleanup for previous effect
  |
  v
controller.abort() cancels old request
  |
  v
New request starts for latest query
```

Query library style example:

```tsx
function SearchResults({ query }: { query: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.length > 0,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load results</p>

  return (
    <ul>
      {data?.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  )
}
```

Why query libraries help:

- They track requests by query key.
- They cache previous results.
- They avoid unnecessary duplicate requests.
- They can refetch stale data in the background.
- They handle loading, error, retry, and invalidation patterns.

Resume-based example:

In Stablehouse onboarding, stale requests could happen if a user moves quickly between POI, POA, Investor Type, and Account Type screens while API requests are still running. If an older request finishes late, it should not overwrite the latest onboarding state.

For document upload and onboarding submission workflows, I would use request cancellation, query keys, or mutation state management to ensure the UI always reflects the latest user action.

Interview summary:

Stale requests happen when older API responses arrive after newer ones. I handle them by cancelling old requests with `AbortController` or by using query libraries like TanStack Query, RTK Query, or Apollo Client. This prevents outdated data from overwriting the latest UI state.

Example from your resume:

In XBTO Stablehouse, you integrated GraphQL APIs for document upload workflows, onboarding data submission, and dynamic screen rendering. A good way to explain that:

I would organize GraphQL operations by feature. For example, POI and POA document uploads would have their own mutations, typed inputs, response models, and hooks. The UI component would call a custom hook like `useSubmitDocument`, not directly construct GraphQL requests.

Example:

```tsx
function DocumentUploadStep() {
  const { submitDocument, isLoading, error } = useSubmitDocument()

  async function handleUpload(file: File) {
    await submitDocument({ documentType: 'POI', file })
  }

  return (
    <DocumentUpload
      onUpload={handleUpload}
      isLoading={isLoading}
      error={error}
    />
  )
}
```

Interview answer:

I organize APIs by feature, with a shared HTTP or GraphQL client underneath. Components should call custom hooks or service functions rather than directly handling request details. This keeps API logic testable, reusable, and easier to maintain. In my Stablehouse onboarding work, this approach fits document upload, onboarding submission, and dynamic screen rendering workflows.

### How do you manage global state?

First, I separate state by type. Not all state belongs in a global store.

State decision table:

```text
State Type              Recommended Approach
---------------------   ---------------------------------
Form input              Local state / form library
Modal open state        Local state
Selected tab/filter     Local state or URL search params
Theme/locale            Context or small store
Auth user/session       Auth provider / global store
Backend data            TanStack Query / Apollo / RTK Query
Complex client state    Redux / Zustand / reducer pattern
```

Use local state when:

- Only one component needs the value.
- The state is temporary UI state.
- The value does not need to survive navigation.

Use Context when:

- Many components need a low-frequency shared value.
- Examples: theme, locale, current user, feature flags.

Use Redux or another global store when:

- Many unrelated components need to update shared client state.
- State transitions are complex.
- You need devtools, middleware, persistence, or action logs.

Use a server-state library when:

- Data comes from backend APIs.
- You need caching, refetching, retries, invalidation, or stale data handling.

Example from your resume:

In HNB Digital Lobby, you used React Hooks, Context API, and Redux. A strong way to explain this:

For simple local UI state, I used hooks. For app-level values, Context API was useful. For more complex shared state across modules, Redux provided predictable updates and better debugging. For API-driven data, I would keep it separate from UI state and use a query/caching approach where available.

Interview answer:

I do not put everything in Redux or Context. I first classify the state. Local UI state stays local. App-wide settings can go into Context. Complex shared client state can go into Redux. Backend data should be handled as server state with caching and invalidation. This keeps the architecture simpler and prevents unnecessary re-renders.

Server state explanation:

Backend data is called server state because the real source of truth lives on the server, not inside the React app.

Examples of server state:

- User profile loaded from an API.
- Onboarding status from backend.
- Uploaded document status.
- Payment methods.
- Transaction history.
- Dashboard data.

This data is different from local UI state.

```text
Client UI state                 Server state
----------------------------    -----------------------------
Modal open/closed               User profile from API
Selected tab                    Onboarding status from backend
Search input text               Uploaded document verification status
Theme preference                Payment transaction history
Form draft before submit        Account details from backend
```

Why backend data needs caching:

If multiple components need the same backend data, we should not refetch it again and again unnecessarily.

Without caching:

```text
ProfileHeader requests /user
Sidebar requests /user
Dashboard requests /user

Result: 3 duplicate API calls for the same data
```

With caching:

```text
First component requests /user
  |
  v
Data is stored in cache
  |
  +-- ProfileHeader uses cached user
  +-- Sidebar uses cached user
  +-- Dashboard uses cached user
```

Visual diagram:

```text
React Components
  |
  +-- ProfileHeader
  +-- Sidebar
  +-- Dashboard
          |
          v
   Query Cache / Server State Layer
          |
          v
      Backend API
```

Why backend data needs invalidation:

Invalidation means marking cached data as outdated after a mutation, so the app knows it should refetch fresh data.

Example:

```text
User uploads POI document
  |
  v
Mutation succeeds
  |
  v
Invalidate "onboardingStatus" query
  |
  v
Refetch latest onboarding status
  |
  v
UI shows updated document status
```

Example with TanStack Query style:

```tsx
function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: fetchOnboardingStatus,
  })
}

function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['onboardingStatus'],
      })
    },
  })
}
```

What this means:

- `useOnboardingStatus` reads backend data and caches it.
- `useUploadDocument` changes backend data.
- After upload succeeds, `invalidateQueries` tells the app the old onboarding status may be stale.
- The latest onboarding status is fetched again.

Can TanStack Query style be used with both REST APIs and GraphQL APIs?

Yes. TanStack Query is not tied to REST or GraphQL. It does not care how the data is fetched. It only needs a function that returns a Promise.

That Promise can come from:

- `fetch`
- Axios
- GraphQL client
- Apollo request function
- custom SDK
- any async API function

Mental model:

```text
React Component
  |
  v
useQuery / useMutation
  |
  v
queryFn / mutationFn
  |
  +-- REST API call
  |
  +-- GraphQL API call
  |
  +-- Any async backend call
```

REST API example:

```tsx
async function fetchOnboardingStatus() {
  const response = await fetch('/api/onboarding/status')

  if (!response.ok) {
    throw new Error('Failed to load onboarding status')
  }

  return response.json()
}

function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: fetchOnboardingStatus,
  })
}
```

Axios REST example:

```tsx
async function fetchOnboardingStatus() {
  const response = await axios.get('/api/onboarding/status')
  return response.data
}

function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: fetchOnboardingStatus,
  })
}
```

GraphQL example:

```tsx
const ONBOARDING_STATUS_QUERY = `
  query OnboardingStatus {
    onboardingStatus {
      currentStep
      poiStatus
      poaStatus
      livenessStatus
    }
  }
`

async function fetchOnboardingStatus() {
  const response = await graphqlClient.request(ONBOARDING_STATUS_QUERY)
  return response.onboardingStatus
}

function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: fetchOnboardingStatus,
  })
}
```

GraphQL mutation with invalidation:

```tsx
const UPLOAD_DOCUMENT_MUTATION = `
  mutation UploadDocument($input: UploadDocumentInput!) {
    uploadDocument(input: $input) {
      success
    }
  }
`

function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UploadDocumentInput) => {
      return graphqlClient.request(UPLOAD_DOCUMENT_MUTATION, { input })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['onboardingStatus'],
      })
    },
  })
}
```

Interview summary:

TanStack Query works with both REST and GraphQL because it manages server-state behavior, not the API protocol. REST or GraphQL is only inside the `queryFn` or `mutationFn`.

How does caching work?

Caching means storing the result of an API request so the app can reuse it instead of calling the backend again every time.

Simple example:

```text
First visit to onboarding page
  |
  v
No cache found for ['onboardingStatus']
  |
  v
Call backend API
  |
  v
Store response in cache
  |
  v
Render UI
```

Second component asks for the same data:

```text
Another component asks for ['onboardingStatus']
  |
  v
Cache already has data
  |
  v
Return cached data immediately
  |
  v
No duplicate API call needed immediately
```

Visual diagram:

```text
Component A: useOnboardingStatus()
Component B: useOnboardingStatus()
Component C: useOnboardingStatus()
              |
              v
        Query Cache
   key: ['onboardingStatus']
              |
              v
        Backend API only when needed
```

The important part is the `queryKey`.

```tsx
useQuery({
  queryKey: ['onboardingStatus'],
  queryFn: fetchOnboardingStatus,
})
```

The query key is like the cache address.

```text
Cache
  |
  +-- ['onboardingStatus'] -> onboarding status data
  |
  +-- ['userProfile'] -> user profile data
  |
  +-- ['transactions', pageNumber] -> transaction list for that page
```

Example with different cache entries:

```tsx
useQuery({
  queryKey: ['transactions', 1],
  queryFn: () => fetchTransactions(1),
})

useQuery({
  queryKey: ['transactions', 2],
  queryFn: () => fetchTransactions(2),
})
```

These are two different cache entries:

```text
['transactions', 1] -> page 1 data
['transactions', 2] -> page 2 data
```

What does invalidation do?

Invalidation tells the cache:

This data may be old now. Please refetch it when needed.

Example:

```text
Cached onboarding status:
  poiStatus = "pending"

User uploads POI document
  |
  v
Backend changes POI status
  |
  v
Cached data is now possibly old
  |
  v
invalidateQueries(['onboardingStatus'])
  |
  v
Refetch latest onboarding status
```

Without invalidation:

```text
User uploads document
  |
  v
Backend updates status
  |
  v
Frontend still shows old cached status
```

With invalidation:

```text
User uploads document
  |
  v
Backend updates status
  |
  v
Frontend marks cache stale
  |
  v
Frontend refetches latest status
  |
  v
UI becomes correct
```

Resume-based Stablehouse example:

For your Stablehouse onboarding work, imagine these screens:

```text
POI Upload screen
POA Upload screen
Investor Type screen
Account Type screen
Liveness Verification screen
```

All of them may need the same onboarding status from the backend.

Without caching:

```text
POI screen calls onboarding status API
POA screen calls onboarding status API
Liveness screen calls onboarding status API

Result: repeated calls and duplicated loading logic
```

With caching:

```text
First screen loads onboarding status
  |
  v
TanStack Query stores it in cache
  |
  +-- POI screen uses cached status
  +-- POA screen uses cached status
  +-- Liveness screen uses cached status
```

After document upload:

```text
Upload POI document
  |
  v
GraphQL mutation succeeds
  |
  v
Invalidate ['onboardingStatus']
  |
  v
Refetch latest status
  |
  v
Move user to the next correct onboarding step
```

Strong interview answer:

Caching stores API responses by query key so multiple components can reuse the same backend data without duplicate requests. Invalidation is used after mutations to mark cached data as stale and refetch the latest server value. TanStack Query can do this for both REST and GraphQL because the API type only affects the fetch function, not the caching model.

Is TanStack Query the same as RTK Query?

No. They solve a similar problem, but they are not the same library.

Both are used for server state:

- Fetching backend data.
- Caching API responses.
- Handling loading and error states.
- Refetching stale data.
- Invalidating data after mutations.

But they fit differently in an application.

High-level comparison:

```text
TanStack Query
  |
  +-- Standalone server-state library
  +-- Works with any state management approach
  +-- You write queryFn and mutationFn
  +-- Great when you do not want Redux

RTK Query
  |
  +-- Part of Redux Toolkit
  +-- Uses Redux store internally
  +-- You define API slices and endpoints
  +-- Great when app already uses Redux Toolkit
```

Visual diagram:

```text
TanStack Query architecture

React Component
  |
  v
useQuery / useMutation
  |
  v
TanStack Query Cache
  |
  v
REST / GraphQL / any async API
```

```text
RTK Query architecture

React Component
  |
  v
Auto-generated RTK Query hook
  |
  v
Redux Store
  |
  v
RTK Query API Slice Cache
  |
  v
REST / GraphQL / backend API
```

TanStack Query REST example:

```tsx
async function fetchMovies() {
  const response = await fetch('/api/movies')

  if (!response.ok) {
    throw new Error('Failed to load movies')
  }

  return response.json()
}

function Movies() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load movies</p>

  return (
    <ul>
      {data.map((movie: { id: number; title: string }) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
```

RTK Query REST example:

```tsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], void>({
      query: () => '/movies',
    }),
  }),
})

export const { useGetMoviesQuery } = moviesApi
```

Usage:

```tsx
function Movies() {
  const { data, isLoading, error } = useGetMoviesQuery()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load movies</p>

  return (
    <ul>
      {data?.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
```

Invalidation difference:

TanStack Query invalidation:

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: uploadDocument,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['onboardingStatus'],
    })
  },
})
```

RTK Query invalidation:

```tsx
export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['OnboardingStatus'],
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<OnboardingStatus, void>({
      query: () => '/onboarding/status',
      providesTags: ['OnboardingStatus'],
    }),
    uploadDocument: builder.mutation<void, UploadDocumentInput>({
      query: (body) => ({
        url: '/onboarding/document',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OnboardingStatus'],
    }),
  }),
})
```

Main differences:

```text
Topic                  TanStack Query                  RTK Query
--------------------   -----------------------------   ----------------------------
Redux required?         No                              Yes, Redux Toolkit based
Setup style             Hooks + query functions         API slices + endpoints
Cache location          TanStack Query cache            Redux store
Best fit                Any React app                   Apps already using Redux
REST support            Yes                             Yes
GraphQL support         Yes                             Yes
Generated hooks         No, you write hooks/functions    Yes, from API slice
Invalidation style      queryKey invalidation           tag invalidation
DevTools                TanStack Query Devtools          Redux DevTools
```

When to choose TanStack Query:

- The app does not use Redux.
- You want a dedicated server-state library.
- You want flexible query functions for REST, GraphQL, or custom clients.
- You prefer direct query keys and query invalidation.

When to choose RTK Query:

- The app already uses Redux Toolkit.
- Your team wants API state inside Redux infrastructure.
- You like generated hooks from API slices.
- You want tag-based invalidation integrated with Redux DevTools.

Resume-based example:

In your HNB Digital Lobby experience, you used Redux and Context API. If the application already had Redux Toolkit, RTK Query could be a natural choice for API calls because API state would live inside the Redux ecosystem.

In your Stablehouse onboarding project with GraphQL document upload workflows, TanStack Query could also be a strong choice because it can manage GraphQL server state with query keys, mutations, caching, and invalidation without requiring Redux.

Interview summary:

TanStack Query and RTK Query both manage server state, caching, loading, errors, and invalidation. TanStack Query is standalone and works well with any React state setup. RTK Query is part of Redux Toolkit and is best when the app already uses Redux. The choice depends on the existing architecture and team preference.

Resume-based example:

In the Stablehouse onboarding project, POI, POA, Investor Type, Account Type, and Liveness Verification depend on backend onboarding status.

If the user uploads a POI document, the frontend should not manually guess the final verification state. Instead:

```text
Upload POI document
  |
  v
Backend stores document
  |
  v
Invalidate onboarding status cache
  |
  v
Refetch onboarding status
  |
  v
Show next correct onboarding step
```

This is safer than storing backend data only in Redux or Context because server-state tools handle caching, stale data, refetching, retries, and invalidation more naturally.

Interview summary:

Backend data should be treated as server state because the backend owns the truth. The frontend should cache it for performance and invalidate it after mutations so the UI stays fresh. For example, after uploading a POI or POA document in an onboarding flow, I would invalidate the onboarding status query and refetch the latest status instead of manually updating many components.

### How do you handle authentication?

Authentication architecture should cover login, logout, session restoration, protected routes, token/cookie handling, and authorization.

Basic auth flow:

```text
User opens app
  |
  v
Check existing session
  |
  +-- valid session --> load user --> render private routes
  |
  +-- no session ----> render login/public routes
```

Recommended auth state model:

```ts
type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; user: User }
```

Example provider shape:

```tsx
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    async function restoreSession() {
      try {
        const user = await getCurrentUser()
        setAuthState({ status: 'authenticated', user })
      } catch {
        setAuthState({ status: 'guest' })
      }
    }

    restoreSession()
  }, [])

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}
```

Protected route example:

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth()

  if (authState.status === 'loading') {
    return <p>Checking session...</p>
  }

  if (authState.status === 'guest') {
    return <Navigate to="/login" replace />
  }

  return children
}
```

Security points to mention:

- Frontend route protection is for user experience, not true security.
- Backend APIs must enforce authentication and authorization.
- HTTP-only secure cookies are often safer for session tokens than localStorage.
- Use role-based access control for UI permissions.
- Handle token/session expiration.
- Clear auth state on logout.

Example from your resume:

In the Stablehouse onboarding platform, authentication and authorization would be important because onboarding includes identity verification, document upload, investor type, account type, and liveness workflows. You can explain:

For a FinTech onboarding platform, I would protect onboarding routes, restore the user session on refresh, enforce step-level access based on onboarding status, and rely on backend authorization for sensitive operations like document upload and identity verification. The frontend would show or hide screens based on auth and onboarding state, but the backend must validate every sensitive request.

Interview answer:

I handle authentication with an auth provider that restores the session, tracks loading/guest/authenticated states, protects private routes, and exposes user/permission data to the app. For security, I never rely only on frontend checks. Backend APIs must validate the session and permissions. In a FinTech onboarding flow like Stablehouse, this is especially important for document upload, identity verification, and account workflows.

## High-Frequency React Deep Dives

### How do you optimize React?

React optimization should start with measurement, not guesswork.

First, identify the problem:

- Is the page loading slowly?
- Is a component re-rendering too often?
- Is a list too large?
- Is the JavaScript bundle too big?
- Is an API call repeated unnecessarily?
- Is an interaction delayed?

Optimization flow:

```text
Measure first
  |
  v
Find the bottleneck
  |
  +-- Too many re-renders ------> State colocation, React.memo
  |
  +-- Expensive calculation ----> useMemo
  |
  +-- Unstable callbacks ------- > useCallback
  |
  +-- Large list --------------- > Virtualization
  |
  +-- Large bundle ------------- > Code splitting, lazy loading
  |
  +-- Repeated API calls --------> Server-state caching
```

Common optimization techniques:

- Use React DevTools Profiler to find expensive renders.
- Keep state close to where it is used.
- Avoid putting every state value in a top-level parent or context.
- Use `React.memo` for expensive child components with stable props.
- Use `useMemo` for expensive derived calculations.
- Use `useCallback` when stable function identity matters.
- Use lazy loading and code splitting for large routes.
- Use virtualization for large lists.
- Cache server data with TanStack Query, RTK Query, Apollo, or similar tools.
- Optimize images, fonts, and bundle size.

Example: avoid recalculating expensive filtered data on every render.

```tsx
const filteredMovies = useMemo(() => {
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase()),
  )
}, [movies, searchText])
```

Example: keep state local.

```tsx
function SearchBox() {
  const [query, setQuery] = useState('')

  return (
    <input value={query} onChange={(event) => setQuery(event.target.value)} />
  )
}
```

If only `SearchBox` needs `query`, keeping it local prevents unrelated parent or sibling re-renders.

Resume-based example:

In your HNB Digital Lobby project, you improved page load time using React Profiler-based optimizations and lazy loading. A strong interview answer:

I first identify whether the issue is rendering, bundle size, network, or large data. In HNB Digital Lobby, we used React Profiler to find expensive areas and lazy loading to reduce initial load. I avoid optimizing blindly and focus on measured bottlenecks.

Interview summary:

React optimization means measuring first, then applying the right technique: memoization for expensive renders, state colocation for unnecessary re-renders, virtualization for large lists, lazy loading for bundle size, and server-state caching for repeated API calls.

### React.memo vs useMemo

`React.memo` and `useMemo` both help with performance, but they optimize different things.

```text
React.memo
  |
  v
Memoizes a component render

useMemo
  |
  v
Memoizes a calculated value
```

Comparison:

```text
Feature              React.memo                         useMemo
------------------   --------------------------------   ----------------------------
Used on              Component                          Value/calculation
Purpose              Skip child re-render               Avoid recalculating value
Returns              Memoized component                 Memoized value
Common use           Expensive child component          Expensive filter/sort/map
Depends on           Props shallow comparison           Dependency array
```

`React.memo` example:

```tsx
const MovieCard = React.memo(function MovieCard({
  title,
}: {
  title: string
}) {
  console.log('MovieCard rendered')
  return <p>{title}</p>
})
```

If the parent re-renders but `title` is the same, `MovieCard` can skip re-rendering.

`useMemo` example:

```tsx
const sortedMovies = useMemo(() => {
  return [...movies].sort((a, b) => b.rating - a.rating)
}, [movies])
```

The sorting runs again only when `movies` changes.

Using both together:

```tsx
const visibleMovies = useMemo(() => {
  return movies.filter((movie) => movie.rating >= 8)
}, [movies])

return <MovieList movies={visibleMovies} />
```

```tsx
const MovieList = React.memo(function MovieList({
  movies,
}: {
  movies: Movie[]
}) {
  return movies.map((movie) => <p key={movie.id}>{movie.title}</p>)
})
```

Important warning:

`React.memo` does shallow comparison. If you pass a new object, array, or function every render, the memoized component may still re-render.

```tsx
// New object every render, React.memo may not help
<UserCard config={{ showRole: true }} />
```

Better:

```tsx
const config = useMemo(() => ({ showRole: true }), [])

<UserCard config={config} />
```

Interview summary:

Use `React.memo` to memoize a component. Use `useMemo` to memoize a calculated value. Do not use either everywhere. Use them when there is a real rendering or calculation cost.

### useCallback

`useCallback` memoizes a function reference.

That means React keeps the same function between renders until one of its dependencies changes.

Important clarification:

`useCallback` does not stop the function from running.

It only controls whether React creates a new function reference during render.

```text
useCallback controls function creation
onClick controls function execution
```

If a button calls the function, the function runs every time the button is clicked.

Simple definition:

```text
useCallback = remember this function reference
```

Syntax:

```tsx
const memoizedFunction = useCallback(() => {
  // logic
}, [dependencies])
```

Why it exists:

In JavaScript, functions are objects. Every time a component renders, functions declared inside it are recreated.

Example without `useCallback`:

```tsx
function Parent() {
  const [count, setCount] = useState(0)

  function handleSave() {
    console.log('Saved')
  }

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count {count}</button>
      <Child onSave={handleSave} />
    </>
  )
}
```

Every time `Parent` re-renders, `handleSave` is a new function reference.

Visual diagram:

```text
Parent render 1
  |
  v
handleSave function A
  |
  v
Child receives function A

Parent render 2
  |
  v
handleSave function B
  |
  v
Child receives new function B
```

If `Child` is wrapped with `React.memo`, the new function prop can still make `Child` re-render.

Using `useCallback`:

```tsx
function Parent() {
  const [count, setCount] = useState(0)

  const handleSave = useCallback(() => {
    console.log('Saved')
  }, [])

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count {count}</button>
      <Child onSave={handleSave} />
    </>
  )
}
```

Now `handleSave` keeps the same function reference because its dependency array is empty.

Visual diagram:

```text
Parent render 1
  |
  v
handleSave function A
  |
  v
Child receives function A

Parent render 2
  |
  v
React reuses function A
  |
  v
Child receives same function A
```

Example with `React.memo`:

```tsx
const UploadButton = React.memo(function UploadButton({
  onUpload,
}: {
  onUpload: () => void
}) {
  console.log('UploadButton rendered')
  return <button onClick={onUpload}>Upload</button>
})

function DocumentUploadStep() {
  const [fileName, setFileName] = useState('')

  const handleUpload = useCallback(() => {
    console.log('Uploading document')
  }, [])

  return (
    <>
      <input
        value={fileName}
        onChange={(event) => setFileName(event.target.value)}
      />
      <UploadButton onUpload={handleUpload} />
    </>
  )
}
```

Here, typing in the input re-renders `DocumentUploadStep`, but `UploadButton` can skip re-rendering because `handleUpload` keeps the same reference.

Simple interview example:

```tsx
const Child = memo(function Child({ onSave }: { onSave: () => void }) {
  console.log('Child rendered')

  return <button onClick={onSave}>Save</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const handleSave = useCallback(() => {
    console.log('Saved:', name)
  }, [name])

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render parent: {count}
      </button>

      <input value={name} onChange={(event) => setName(event.target.value)} />

      <Child onSave={handleSave} />
    </>
  )
}
```

What happens:

```text
Click "Re-render parent"
  |
  v
Parent re-renders
  |
  v
name did not change
  |
  v
useCallback reuses same handleSave function
  |
  v
Child can skip re-render because onSave is same
```

```text
Type in input
  |
  v
name changes
  |
  v
useCallback creates new handleSave function
  |
  v
Child receives new onSave prop and re-renders
```

```text
Click "Save"
  |
  v
button calls handleSave
  |
  v
console.log runs every time
```

Main interview line:

`useCallback` does not prevent the Save click. It helps the child avoid re-rendering when unrelated parent state changes.

Important dependency example:

```tsx
const handleSubmit = useCallback(() => {
  submitDocument(documentId)
}, [documentId])
```

If the callback uses `documentId`, it must be included in the dependency array. Otherwise, the callback may use a stale value.

Common mistake:

```tsx
const handleSubmit = useCallback(() => {
  submitDocument(documentId)
}, [])
```

This is wrong if `documentId` can change. The function may keep using the old `documentId`.

When should you use `useCallback`?

Use it when:

- Passing a callback to a memoized child component.
- The callback is a dependency of another hook.
- A custom hook expects a stable callback.
- A function is passed deep into expensive child trees.

Do not use it everywhere.

Bad reason:

```text
I use useCallback for every function because it is always faster.
```

Better answer:

```text
I use useCallback when stable function identity matters.
```

`useCallback` vs `useMemo`:

```text
useCallback
  |
  v
Memoizes a function

useMemo
  |
  v
Memoizes a value
```

These two are similar:

```tsx
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])
```

```tsx
const handleClick = useMemo(() => {
  return () => {
    console.log('clicked')
  }
}, [])
```

In practice, use `useCallback` for functions because it is clearer.

Where `useCallback` fits in your resume:

HNB Digital Lobby:

You worked on reusable components, shared frontend libraries, Redux/Context state, real-time rendering, and React Profiler-based optimizations. `useCallback` fits here when reusable child components receive event handlers from parent screens.

Example interview explanation:

In HNB Digital Lobby, we had reusable components across modules. If a parent screen passed callbacks like `onSelectCustomer`, `onSubmitForm`, or `onRefreshData` into memoized child components, `useCallback` would help keep those function references stable and avoid unnecessary child re-renders.

Stablehouse onboarding:

You worked on POI, POA, Investor Type, Account Type, document upload, and Liveness Verification workflows. `useCallback` fits well for upload handlers, step navigation handlers, and form submission callbacks passed into reusable onboarding components.

Example:

```tsx
function PoiUploadStep({ documentId }: { documentId: string }) {
  const handleUpload = useCallback(
    async (file: File) => {
      await uploadDocument({
        documentId,
        documentType: 'POI',
        file,
      })
    },
    [documentId],
  )

  return <DocumentUpload onUpload={handleUpload} />
}
```

If `DocumentUpload` is memoized, `useCallback` helps prevent it from re-rendering unless `documentId` changes.

Stablehouse visual example:

```text
PoiUploadStep
  |
  +-- state: selected file, upload status
  |
  +-- useCallback(handleUpload)
          |
          v
     DocumentUpload component
          |
          v
     Calls stable onUpload callback
```

ChoicePay:

For payment workflows, callbacks like `onSelectPaymentMethod`, `onApplyGiftCard`, or `onSubmitPayment` could be stabilized when passed into memoized payment method components.

Interview summary:

`useCallback` memoizes a function reference. I use it when function identity matters, especially when passing callbacks to memoized child components or custom hooks. In my projects, it fits reusable flows like HNB Digital Lobby shared components and Stablehouse onboarding document upload steps, where stable handlers can reduce unnecessary renders and keep component APIs clean.

### Context API vs Redux

Context API and Redux both can share state, but they are designed for different levels of complexity.

Visual diagram:

```text
Context API
  |
  v
Provider gives value
  |
  v
Nested components consume value
```

```text
Redux
  |
  v
Component dispatches action
  |
  v
Reducer updates store
  |
  v
Subscribed components receive new state
```

Use Context API when:

- The state is simple.
- Updates are not very frequent.
- Many nested components need the same value.
- Examples: theme, locale, current user, feature flags.

Context example:

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Dashboard />
    </ThemeContext.Provider>
  )
}
```

Use Redux when:

- Many unrelated components need shared state.
- State updates are complex.
- You need predictable actions and reducers.
- You need Redux DevTools, middleware, persistence, or strict team conventions.
- Examples: complex client state, multi-step global workflows, cross-module UI state.

Redux-style mental model:

```text
UI event
  |
  v
dispatch({ type: 'cart/addItem' })
  |
  v
Reducer calculates next state
  |
  v
Store updates
  |
  v
UI re-renders from selected state
```

Important note:

For backend data, neither plain Context nor plain Redux is usually ideal. Server data is better handled by TanStack Query, RTK Query, Apollo Client, or similar tools because they handle caching, stale data, retries, and invalidation.

Resume-based example:

In your HNB Digital Lobby project, you used Hooks, Context API, and Redux. You can explain:

For simple module-level UI state, I used hooks. For app-wide low-frequency values, Context API was useful. For more complex shared state across modules, Redux provided predictable updates and better debugging. For backend API data, I would treat it as server state and use a query/caching approach where available.

Interview summary:

Context is best for simple shared values and dependency injection. Redux is better for complex shared client state with predictable updates and tooling. Server data should usually be handled with a server-state library, not plain Context.

### Virtual DOM

The Virtual DOM is a lightweight JavaScript representation of the UI.

React uses it to figure out what changed before updating the real DOM.

Visual diagram:

```text
State changes
  |
  v
React creates new Virtual DOM tree
  |
  v
React compares old tree vs new tree
  |
  v
React finds minimal changes
  |
  v
React updates the real DOM
```

Example:

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}
```

When `count` changes:

```text
Old Virtual DOM:
<p>Count: 0</p>

New Virtual DOM:
<p>Count: 1</p>

React updates only the changed text in the real DOM.
```

Important interview points:

- The Virtual DOM is not the browser DOM.
- Updating the real DOM can be expensive.
- React uses reconciliation to compare trees.
- Keys help React match list items correctly.
- Virtual DOM does not automatically mean every app is fast. Bad state design or huge renders can still be slow.

Interview summary:

The Virtual DOM is React's in-memory UI representation. React compares the previous and next trees, then updates only the necessary parts of the real DOM.

### Error Boundaries

Error Boundaries are React components that catch rendering errors in their child component tree and show fallback UI.

They prevent one broken section from crashing the whole app.

Visual diagram:

```text
App
  |
  +-- Header
  |
  +-- ErrorBoundary
        |
        +-- Dashboard
        +-- RiskyWidget throws error
              |
              v
        ErrorBoundary catches it
              |
              v
        Shows fallback UI
```

Class component example:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Report error:', error, info)
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

```tsx
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

What Error Boundaries catch:

- Errors during rendering.
- Errors in lifecycle methods.
- Errors in constructors of child class components.

What Error Boundaries do not catch:

- Event handler errors.
- Async errors in promises.
- `setTimeout` errors.
- Server-side rendering errors.
- Errors inside the error boundary itself.

Event handler errors need `try/catch`:

```tsx
function SaveButton() {
  const [error, setError] = useState('')

  function handleClick() {
    try {
      throw new Error('Save failed')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <>
      <button onClick={handleClick}>Save</button>
      {error && <p role="alert">{error}</p>}
    </>
  )
}
```

Where to place Error Boundaries:

- Around routes.
- Around dashboards.
- Around complex widgets.
- Around third-party components.
- Around high-risk feature areas.

Resume-based example:

In Stablehouse onboarding, an Error Boundary could wrap high-risk sections like document upload, POI/POA verification, or Liveness Verification. If one widget fails, the app can show a fallback for that section instead of crashing the full onboarding flow.

Interview summary:

Error Boundaries catch render errors in child components and show fallback UI. They are useful around routes and risky UI sections. They do not catch event handler or async errors, so those need separate `try/catch` or API error state handling.

## APIs And React Lifecycle Deep Dive

### How do you handle API failures?

API failure handling means the UI should not break when the backend request fails. It should show a clear error state, allow retry when possible, and avoid stale or incorrect data.

API request states:

```text
Idle
  |
  v
Loading
  |
  +-- Success --> Show data
  |
  +-- Empty ----> Show empty state
  |
  +-- Error ----> Show error message + retry
```

Basic API failure example:

```tsx
function Movies() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState('')

  async function loadMovies() {
    try {
      setStatus('loading')
      setError('')

      const response = await fetch('/api/movies')

      if (!response.ok) {
        throw new Error('Failed to load movies')
      }

      const data = await response.json()
      setMovies(data)
      setStatus('success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      setStatus('error')
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  if (status === 'loading') return <p>Loading...</p>

  if (status === 'error') {
    return (
      <div>
        <p role="alert">{error}</p>
        <button onClick={loadMovies}>Retry</button>
      </div>
    )
  }

  if (movies.length === 0) return <p>No movies found.</p>

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
```

Production considerations:

- Show user-friendly error messages.
- Add retry for recoverable failures.
- Use `AbortController` for stale requests.
- Log/report unexpected errors.
- Handle `401` and `403` separately for auth/permission issues.
- Handle empty data separately from error data.
- Use TanStack Query, RTK Query, Apollo, or SWR for retries, caching, stale data, and invalidation.

Visual diagram:

```text
Component calls API
  |
  v
Backend response
  |
  +-- 200 OK ---------> Render data
  |
  +-- 204/empty ------> Render empty state
  |
  +-- 401 ------------> Redirect/login/session expired
  |
  +-- 403 ------------> Show access denied
  |
  +-- 500/network ----> Show error + retry
```

Resume-based example:

For Stablehouse onboarding, document upload or GraphQL submission can fail due to network issues, invalid file format, expired session, or backend validation. A good UI should show a specific error, allow retry, and not move the user to the next onboarding step until the backend confirms success.

Interview summary:

I handle API failures with explicit loading, success, empty, and error states. I show user-friendly messages, provide retry where possible, handle auth errors separately, cancel stale requests, and use query libraries for caching, retries, and invalidation in production.

### How do you cancel stale requests?

A stale request is an older API request that finishes after a newer request and tries to update the UI with outdated data.

This commonly happens in:

- Search boxes.
- Typeahead/autocomplete.
- Filters.
- Fast route changes.
- Switching between tabs that fetch data.
- Upload or verification workflows where users move quickly between steps.

Problem diagram:

```text
User searches "re"
  |
  v
Request A starts

User quickly searches "react"
  |
  v
Request B starts

Request B finishes first
  |
  v
UI shows "react" results

Request A finishes later
  |
  v
Problem: old "re" results may overwrite "react" results
```

Best approach: use `AbortController`.

```tsx
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) return

    const controller = new AbortController()

    async function loadResults() {
      try {
        const response = await fetch(`/api/search?q=${query}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load results')
        }

        const data = await response.json()
        setResults(data)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    loadResults()

    return () => {
      controller.abort()
    }
  }, [query])

  if (error) return <p role="alert">{error}</p>

  return (
    <ul>
      {results.map((result) => (
        <li key={result}>{result}</li>
      ))}
    </ul>
  )
}
```

How it works:

```text
query = "re"
  |
  v
Request A starts

query changes to "react"
  |
  v
React runs cleanup for previous effect
  |
  v
controller.abort() cancels Request A
  |
  v
Request B starts

Only latest request updates UI
```

Alternative approach: ignore stale responses.

Use this when the async work cannot be truly cancelled.

```tsx
useEffect(() => {
  let ignore = false

  async function loadResults() {
    const response = await fetch(`/api/search?q=${query}`)
    const data = await response.json()

    if (!ignore) {
      setResults(data)
    }
  }

  loadResults()

  return () => {
    ignore = true
  }
}, [query])
```

Flow:

```text
Old request finishes late
  |
  v
ignore is true
  |
  v
Do not update state
```

Another alternative: request ID check.

```tsx
const requestIdRef = useRef(0)

useEffect(() => {
  const requestId = requestIdRef.current + 1
  requestIdRef.current = requestId

  async function loadResults() {
    const response = await fetch(`/api/search?q=${query}`)
    const data = await response.json()

    if (requestId === requestIdRef.current) {
      setResults(data)
    }
  }

  loadResults()
}, [query])
```

Resume-based example:

In Stablehouse onboarding, stale requests could happen if a user moves quickly between POI, POA, Investor Type, Account Type, and Liveness Verification screens while API calls are still running.

Example:

```text
User opens POI step
  |
  v
POI status request starts

User quickly moves to POA step
  |
  v
POA status request starts

POA status returns first
  |
  v
UI shows POA data

POI status returns late
  |
  v
Should not overwrite POA screen
```

Interview summary:

I cancel stale requests using `AbortController` inside `useEffect` cleanup. When dependencies like search query, route params, or onboarding step change, React runs cleanup, aborts the previous request, and starts a new one. If cancellation is not possible, I ignore late responses with an `ignore` flag or request ID check.

### Explain REST integration

REST integration means connecting a React app to backend endpoints using HTTP methods like `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

Common REST methods:

```text
GET       Read data
POST      Create data
PUT       Replace data
PATCH     Partially update data
DELETE    Remove data
```

REST flow diagram:

```text
React Component
  |
  v
API service function
  |
  v
HTTP client: fetch / Axios
  |
  v
REST endpoint
  |
  v
Backend response
  |
  v
Update UI state
```

Recommended project structure:

```text
src/
  services/
    httpClient.ts

  features/
    onboarding/
      api/
        onboardingApi.ts
      hooks/
        useOnboardingStatus.ts
      components/
        OnboardingStatus.tsx
```

Axios client example:

```ts
// services/httpClient.ts
import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

httpClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

API service example:

```ts
// features/onboarding/api/onboardingApi.ts
import { httpClient } from '../../../services/httpClient'

export function getOnboardingStatus() {
  return httpClient.get('/onboarding/status').then((response) => response.data)
}

export function uploadDocument(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return httpClient
    .post('/onboarding/documents', formData)
    .then((response) => response.data)
}
```

Component usage:

```tsx
function OnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)

  useEffect(() => {
    getOnboardingStatus().then(setStatus)
  }, [])

  return <p>Current step: {status?.currentStep}</p>
}
```

Note about `.then(setStatus)`:

This line:

```tsx
getOnboardingStatus().then(setStatus)
```

means the same thing as:

```tsx
getOnboardingStatus().then((data) => {
  setStatus(data)
})
```

Whatever `getOnboardingStatus()` returns will be passed automatically into `setStatus`.

Example:

```tsx
function getOnboardingStatus() {
  return Promise.resolve({
    currentStep: 'POI',
    poiStatus: 'pending',
  })
}
```

Then this:

```tsx
getOnboardingStatus().then(setStatus)
```

sets state to:

```tsx
{
  currentStep: 'POI',
  poiStatus: 'pending',
}
```

This works because `.then()` expects a function, and `setStatus` is already a function. For interview clarity, the longer version is easier to explain:

```tsx
getOnboardingStatus().then((data) => {
  setStatus(data)
})
```

Best practices:

- Keep REST calls in API service files.
- Keep auth headers centralized.
- Use typed request and response models.
- Handle errors consistently.
- Use query libraries for server-state caching.
- Do not write raw API calls inside every UI component.

Resume-based example:

In HNB Digital Lobby and ChoicePay, REST APIs were used for real-time rendering and payment workflows. A strong interview answer:

I organize REST APIs behind service functions or custom hooks. Components call `usePaymentMethods` or `getOnboardingStatus`, not raw Axios logic. This keeps UI clean and makes API behavior reusable and testable.

### How do you cache API data?

Caching API data means storing the response from a backend request so the app can reuse it without calling the backend again immediately.

Simple caching idea:

```text
First request
  |
  v
No cache found
  |
  v
Call backend
  |
  v
Store response in cache
  |
  v
Render UI
```

Second request for same data:

```text
Component asks for same data
  |
  v
Cache has data
  |
  v
Return cached data immediately
  |
  v
Optionally refetch in background
```

Cache diagram:

```text
ProfileHeader ----+
Sidebar ----------+----> Query Cache ----> Backend API
Dashboard --------+       ['user']
```

With TanStack Query:

```tsx
function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: fetchOnboardingStatus,
    staleTime: 60_000,
  })
}
```

What `staleTime` means:

```text
staleTime: 60_000
  |
  v
For 60 seconds, cached data is considered fresh
  |
  v
Components can reuse it without immediate refetch
```

Invalidation after mutation:

```tsx
function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['onboardingStatus'],
      })
    },
  })
}
```

Invalidation flow:

```text
Upload document
  |
  v
Mutation succeeds
  |
  v
Cached onboarding status may be old
  |
  v
Invalidate ['onboardingStatus']
  |
  v
Refetch latest status
  |
  v
UI shows correct next step
```

Manual cache example without a library:

```ts
const cache = new Map<string, unknown>()

async function cachedFetch<T>(key: string, url: string): Promise<T> {
  if (cache.has(key)) {
    return cache.get(key) as T
  }

  const response = await fetch(url)
  const data = await response.json()
  cache.set(key, data)

  return data
}
```

This manual approach is useful for learning, but production apps usually use a library because caching also needs refetching, invalidation, retries, loading states, and stale request handling.

Resume-based example:

In Stablehouse onboarding, POI, POA, Investor Type, Account Type, and Liveness Verification screens may all need onboarding status. Caching prevents each screen from repeatedly calling the same status API. After a POI document upload succeeds, invalidating onboarding status ensures the next screen sees fresh backend data.

Interview summary:

I cache API data by treating it as server state. I use query keys to store responses, reuse cached data across components, and invalidate the cache after mutations so the UI refetches fresh backend data.

### Lifecycle of React with examples

React's lifecycle is the sequence of steps a component goes through: render, commit, effects, updates, cleanup, and unmount.

Simple interview model:

```text
1. Mount
   Component appears for the first time.

2. Update
   Component re-renders because state, props, context, or external store data changed.

3. Unmount
   Component is removed from the UI.
```

Function component lifecycle mental model:

```text
Initial render
  |
  v
React calculates JSX
  |
  v
Commit DOM updates
  |
  v
Run useEffect
  |
  v
State/props change
  |
  v
Re-render
  |
  v
Cleanup previous effect
  |
  v
Run new effect
  |
  v
Unmount
  |
  v
Final cleanup
```

Render phase vs commit phase:

```text
Render phase
  |
  +-- React calls the component
  +-- React calculates what the UI should look like
  +-- Should stay pure

Commit phase
  |
  +-- React applies changes to the DOM
  +-- Effects run after commit
```

Interview point:

Do not perform side effects during render. API calls, timers, subscriptions, browser event listeners, and manual DOM work should be handled in effects or event handlers.

Example:

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    console.log('Effect: start timer')

    const timerId = window.setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    return () => {
      console.log('Cleanup: stop timer')
      window.clearInterval(timerId)
    }
  }, [])

  return <p>Seconds: {seconds}</p>
}
```

What happens:

```text
Timer mounts
  |
  v
Render <p>Seconds: 0</p>
  |
  v
Effect runs and starts interval
  |
  v
Interval updates state every second
  |
  v
Component re-renders with new seconds
  |
  v
Component unmounts
  |
  v
Cleanup clears interval
```

Effect with dependency lifecycle:

```tsx
function SearchResults({ query }: { query: string }) {
  useEffect(() => {
    console.log('Fetch for:', query)

    return () => {
      console.log('Cleanup previous query:', query)
    }
  }, [query])

  return <p>Search: {query}</p>
}
```

If query changes from `react` to `redux`:

```text
Render with query = react
  |
  v
Effect runs for react
  |
  v
Query changes to redux
  |
  v
Render with query = redux
  |
  v
Cleanup runs for react
  |
  v
Effect runs for redux
```

Class component comparison:

```text
Class component                  Function component
-----------------------------    -----------------------------
componentDidMount                useEffect(..., [])
componentDidUpdate               useEffect(..., [deps])
componentWillUnmount             useEffect cleanup
getDerivedStateFromError         Error Boundary
componentDidCatch                Error Boundary logging
```

Interview summary:

In function components, I think of lifecycle as render, commit, effect, cleanup, and unmount. `useEffect` replaces many class lifecycle use cases, and cleanup is important for timers, subscriptions, and stale requests.

### Does an API call inside `useEffect` run again when the user returns to the screen?

Yes, if the component unmounts when the user navigates away, it will mount again when the user returns. A `useEffect` with an empty dependency array runs on every mount.

Example:

```tsx
function UserDetails() {
  useEffect(() => {
    fetchUserDetails()
  }, [])

  return <section>User details</section>
}
```

Flow:

```text
User visits screen
  |
  v
Component mounts
  |
  v
useEffect runs
  |
  v
API call happens

User navigates away
  |
  v
Component unmounts

User comes back
  |
  v
Component mounts again
  |
  v
useEffect runs again
  |
  v
API call happens again
```

Is this always a performance issue?

Not always. Refetching on mount may be correct when the data must always be fresh.

It can become a performance issue when:

- the same data is fetched repeatedly
- the response is large
- the user navigates back and forth often
- the backend is slow or expensive
- repeated loading states hurt user experience

Better production approach:

Use a server-state library such as TanStack Query, RTK Query, or SWR.

Example with query caching:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["userDetails", userId],
  queryFn: () => fetchUserDetails(userId),
  staleTime: 5 * 60 * 1000,
})
```

What `staleTime` means:

```text
User visits screen
  |
  v
API data is fetched and cached
  |
  v
User navigates away and comes back within 5 minutes
  |
  v
Cached data is reused
  |
  v
No unnecessary API call
```

Manual cache idea:

```jsx
import { useEffect, useState } from "react"

let cachedProducts = null

function ProductsPage() {
  const [products, setProducts] = useState(cachedProducts || [])

  useEffect(() => {
    if (cachedProducts) {
      console.log("Using cached products")
      return
    }

    console.log("API called")

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        cachedProducts = data
        setProducts(data)
      })
  }, [])

  return (
    <div>
      <h2>Products</h2>

      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  )
}
```

Does `cachedProducts` retain data after navigating away?

Yes, because it is declared outside the component as a module-level variable:

```jsx
let cachedProducts = null
```

If `ProductsPage` unmounts and mounts again, the JavaScript module can still keep `cachedProducts` in memory.

But limitations:

```text
Browser refresh -> cache lost
Close tab -> cache lost
Open new tab -> separate cache
App reloads -> cache lost
Complex invalidation -> difficult manually
```

So this is useful for learning, but not ideal for production.

For real projects, prefer TanStack Query, RTK Query, SWR, or Apollo because they handle caching, stale data, refetching, retries, deduplication, and invalidation more reliably.

### Simple examples of API caching libraries

TanStack Query example:

```jsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

function ProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong</p>

  return data.map((product) => (
    <p key={product.id}>{product.name}</p>
  ))
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>
  )
}
```

RTK Query example:

```jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
    }),
  }),
})

export const { useGetProductsQuery } = productsApi

function ProductsPage() {
  const { data, isLoading, error } = useGetProductsQuery()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong</p>

  return data.map((product) => (
    <p key={product.id}>{product.name}</p>
  ))
}
```

Apollo Client example for GraphQL:

```jsx
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client"

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
})

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
    }
  }
`

function ProductsPage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Something went wrong</p>

  return data.products.map((product) => (
    <p key={product.id}>{product.name}</p>
  ))
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ProductsPage />
    </ApolloProvider>
  )
}
```

SWR example:

```jsx
import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

function ProductsPage() {
  const { data, error, isLoading } = useSWR("/api/products", fetcher)

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong</p>

  return data.map((product) => (
    <p key={product.id}>{product.name}</p>
  ))
}
```

### How SWR handles cache

In this example:

```jsx
useSWR("/api/products", fetcher)
```

`"/api/products"` is the cache key.

```text
SWR cache
  |
  +-- "/api/products" -> products response data
```

First visit:

```text
ProductsPage mounts
   |
   v
useSWR("/api/products", fetcher)
   |
   v
SWR checks cache
   |
   v
No cached data found
   |
   v
Calls fetcher("/api/products")
   |
   v
Stores response in cache
   |
   v
Component shows data
```

Navigate away and come back:

```text
ProductsPage mounts again
   |
   v
SWR checks cache for "/api/products"
   |
   v
Cached data found
   |
   v
Shows cached data quickly
   |
   v
May revalidate in background
```

SWR means:

```text
Stale While Revalidate
```

Meaning:

```text
Show cached data first
then fetch latest data in background
then update UI if new data arrives
```

Which one is best?

```text
REST/general React app -> TanStack Query
Redux Toolkit app -> RTK Query
GraphQL-heavy app -> Apollo Client
Simple lightweight fetching -> SWR
```

Interview answer:

If I am building a new React app and only need API caching, I would usually choose TanStack Query because it is standalone and powerful. If the app already uses Redux Toolkit, I would use RTK Query. If the backend is GraphQL-heavy, Apollo Client is often the best fit. For simple lightweight fetching, SWR is also a good option.

Interview answer:

If an API call is inside `useEffect(() => {}, [])`, it runs whenever that component mounts. If the user navigates away and comes back, the component may mount again and the API may be called again. This can cause performance issues if the same data is fetched repeatedly. I would handle this with server-state caching using TanStack Query, RTK Query, SWR, or Apollo, configuring stale time, refetch rules, and cache invalidation based on business needs.

### How do you handle React application Error Boundaries?

Error Boundaries catch rendering errors in their child component tree and show fallback UI instead of crashing the whole React app.

Where they fit:

```text
App
  |
  +-- Header
  |
  +-- ErrorBoundary
  |     |
  |     +-- Dashboard
  |     +-- RiskyWidget
  |
  +-- Footer
```

If `RiskyWidget` crashes:

```text
RiskyWidget throws render error
  |
  v
ErrorBoundary catches error
  |
  v
Dashboard section shows fallback UI
  |
  v
Header and Footer still work
```

Error Boundary example:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Report error to monitoring:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>Something went wrong.</h2>
          <p>Please refresh or try again later.</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

Usage:

```tsx
function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  )
}
```

What Error Boundaries catch:

- Render errors.
- Lifecycle errors.
- Constructor errors in child class components.

What they do not catch:

- Event handler errors.
- Async errors.
- Promise rejections.
- `setTimeout` errors.
- Server-side rendering errors.

Event handler errors need `try/catch`:

```tsx
function SaveButton() {
  const [error, setError] = useState('')

  function handleSave() {
    try {
      throw new Error('Save failed')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <>
      <button onClick={handleSave}>Save</button>
      {error && <p role="alert">{error}</p>}
    </>
  )
}
```

Where to place Error Boundaries in enterprise apps:

- Around route-level pages.
- Around dashboards.
- Around third-party widgets.
- Around document upload or payment modules.
- Around high-risk feature sections.

Resume-based example:

In Stablehouse onboarding, I would place Error Boundaries around high-risk sections like document upload, POI/POA verification, and Liveness Verification. If the Liveness widget crashes, the user should see a helpful fallback for that section rather than losing the entire onboarding flow.

Interview summary:

I use Error Boundaries to isolate render failures and show fallback UI. They are useful around routes and risky widgets. They do not handle event or async errors, so those are handled separately with `try/catch`, API error states, and production monitoring.

## Additional Expected Interview Questions: Low To High Level

This section fills common interview gaps from junior to senior level. Use it as a final sweep after reviewing the earlier sections.

### Low Level: How do components communicate in React?

React components usually communicate through props, callbacks, context, URL state, or shared stores.

```text
Parent -> Child
  |
  v
props

Child -> Parent
  |
  v
callback props

Deep shared data
  |
  v
Context / store
```

Parent to child:

```tsx
function Parent() {
  return <UserCard name="Karteek" />
}

function UserCard({ name }: { name: string }) {
  return <p>{name}</p>
}
```

Child to parent:

```tsx
function Parent() {
  function handleSelect(id: number) {
    console.log('Selected', id)
  }

  return <MovieCard onSelect={handleSelect} />
}

function MovieCard({ onSelect }: { onSelect: (id: number) => void }) {
  return <button onClick={() => onSelect(1)}>Select</button>
}
```

Interview summary:

Props send data down. Callback props send events up. Context or stores share data across distant components.

### Low Level: What is the `children` prop?

`children` is the JSX passed between a component's opening and closing tags.

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <section className="card">{children}</section>
}

function App() {
  return (
    <Card>
      <h2>Onboarding</h2>
      <p>Upload your POI document.</p>
    </Card>
  )
}
```

Use `children` when the parent should control the inner content and the reusable component should control layout or structure.

Resume example:

In Stablehouse onboarding, a reusable `OnboardingStepLayout` could accept different POI, POA, Investor Type, or Liveness content through `children`.

### Low Level: What are fragments and why do we use them?

Fragments group multiple JSX elements without adding an extra DOM node.

```tsx
return (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
)
```

Use fragments when a wrapper `div` would break layout or semantic HTML.

```tsx
function DefinitionRow() {
  return (
    <>
      <dt>React</dt>
      <dd>A UI library</dd>
    </>
  )
}
```

Interview summary:

Fragments avoid unnecessary DOM wrappers and help preserve correct HTML structure.

### Low Level: What is prop drilling and how do you avoid it?

Prop drilling means passing props through multiple intermediate components that do not actually use them.

```text
App
  |
  v
Layout passes user
  |
  v
Sidebar passes user
  |
  v
Avatar uses user
```

Ways to avoid it:

- Component composition.
- Context API.
- Global store.
- Route loaders or server-state hooks.

Example with Context:

```tsx
const UserContext = createContext<User | null>(null)

function Avatar() {
  const user = useContext(UserContext)
  return <p>{user?.name}</p>
}
```

Interview summary:

Avoid prop drilling when many layers only forward data. Use composition first, then Context or a store when the data is truly shared.

### Mid Level: What are portals in React?

Portals render a component into a different DOM node while keeping it in the React component tree.

```tsx
import { createPortal } from 'react-dom'

function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div role="dialog">{children}</div>,
    document.body,
  )
}
```

Visual:

```text
React tree
  App
   |
   +-- Modal component

DOM output
  body
   |
   +-- root
   |
   +-- modal DOM node
```

Use portals for:

- Modals.
- Tooltips.
- Dropdowns.
- Popovers.

Interview summary:

Portals are useful when UI should visually escape parent containers, such as modals that should not be clipped by `overflow: hidden`.

### Mid Level: What is lazy loading and Suspense?

Lazy loading means loading code only when needed. `Suspense` shows fallback UI while lazy code is loading.

```tsx
const Dashboard = lazy(() => import('./Dashboard'))

function App() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Dashboard />
    </Suspense>
  )
}
```

Visual:

```text
Initial load
  |
  v
Load main bundle
  |
  v
User opens Dashboard
  |
  v
Load Dashboard chunk
  |
  v
Suspense shows fallback until ready
```

Resume example:

In HNB Digital Lobby, lazy loading helped reduce initial page load by loading large modules only when needed.

Interview summary:

Lazy loading improves initial load performance. Suspense provides fallback UI while the lazy component is loading.

### Mid Level: What is StrictMode?

`StrictMode` is a development-only tool that helps find unsafe patterns.

It may intentionally run certain render and effect flows more than once in development to catch missing cleanup.

```tsx
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Interview summary:

StrictMode does not affect production behavior. If effects seem to run twice in development, the correct fix is usually to make effects cleanup-safe, not remove StrictMode.

### Mid Level: `useEffect` vs `useLayoutEffect`

`useEffect` runs after the browser paints. `useLayoutEffect` runs after DOM updates but before paint.

```text
Render
  |
  v
Commit DOM
  |
  +-- useLayoutEffect runs before paint
  |
  v
Browser paints
  |
  v
useEffect runs after paint
```

Use `useEffect` for:

- API calls.
- Subscriptions.
- Timers.
- Logging.

Use `useLayoutEffect` for:

- Measuring layout.
- Preventing visual flicker.
- Synchronous DOM positioning.

Example:

```tsx
useLayoutEffect(() => {
  const width = ref.current?.getBoundingClientRect().width
  setWidth(width ?? 0)
}, [])
```

Interview summary:

Use `useEffect` by default. Use `useLayoutEffect` only when layout must be measured or updated before the browser paints.

### Mid Level: What is `useId`?

`useId` generates stable IDs for accessibility relationships.

```tsx
function EmailField() {
  const id = useId()

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} />
    </>
  )
}
```

Do not use `useId` for list keys. List keys should come from stable data IDs.

Interview summary:

`useId` is mainly for accessibility, especially reusable form components that need unique label/input IDs.

### Mid Level: How do you integrate GraphQL in React?

GraphQL integration usually uses a client like Apollo Client, urql, Relay, or a request client with TanStack Query.

GraphQL query:

```graphql
query OnboardingStatus {
  onboardingStatus {
    currentStep
    poiStatus
    poaStatus
  }
}
```

React usage with a request function:

```tsx
async function fetchOnboardingStatus() {
  const response = await graphqlClient.request(ONBOARDING_STATUS_QUERY)
  return response.onboardingStatus
}

function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: fetchOnboardingStatus,
  })
}
```

Visual:

```text
React component
  |
  v
GraphQL query/mutation
  |
  v
GraphQL server
  |
  v
Only requested fields return
```

Resume example:

In Stablehouse, you integrated GraphQL APIs for document upload, onboarding submission, and dynamic screen rendering. You can explain that each onboarding step can have typed queries/mutations and custom hooks like `useUploadDocument`.

### Mid Level: REST vs GraphQL

REST exposes multiple resource-based endpoints. GraphQL exposes a schema where the client requests exactly the fields it needs.

```text
REST
  GET /users/1
  GET /users/1/orders
  GET /users/1/profile

GraphQL
  query {
    user(id: 1) {
      name
      orders { id total }
      profile { avatar }
    }
  }
```

REST advantages:

- Simple and widely understood.
- Works well with HTTP caching.
- Easy for standard CRUD.

GraphQL advantages:

- Client asks for exactly needed fields.
- Good for complex screens.
- Strong schema and typed operations.

Interview summary:

REST is endpoint-based. GraphQL is schema/query-based. I choose based on backend architecture, screen complexity, caching needs, and team standards.

### Mid Level: How do Axios interceptors work?

Axios interceptors let us run logic before a request or after a response.

Common uses:

- Add auth token.
- Add correlation/request ID.
- Handle `401` globally.
- Normalize errors.
- Apply common base URL and timeout.
- Log API errors in one place.

Step 1: Create a reusable Axios client.

```jsx
import axios from "axios"

const httpClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
})
```

Why:

```text
All API calls can share:
- base URL
- timeout
- headers
- error handling
- auth handling
```

Step 2: Request interceptor.

Request interceptors run before the request goes to the backend.

```jsx
httpClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers["x-request-source"] = "react-app"

    return config
  },
  (error) => Promise.reject(error),
)
```

Use cases:

```text
- attach access token
- add request ID or source header
- add tenant/account ID
- set common headers
```

Step 3: Response interceptor.

Response interceptors run after the backend responds.

```jsx
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized. Redirect to login or logout user.")
    }

    if (error.response?.status >= 500) {
      console.log("Server error. Show common error message.")
    }

    return Promise.reject(error)
  },
)
```

Use cases:

```text
- handle 401 unauthorized globally
- handle 403 forbidden globally
- show common 500 error message
- normalize backend error response
- trigger logout/session expiry flow
```

Step 4: Use the Axios client in API functions.

```jsx
export async function getUsers() {
  const response = await httpClient.get("/users")
  return response.data
}

export async function createUser(payload) {
  const response = await httpClient.post("/users", payload)
  return response.data
}
```

Step 5: Use API function in component.

```jsx
import { useEffect, useState } from "react"
import { getUsers } from "./userApi"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true)
        const data = await getUsers()
        setUsers(data)
      } catch {
        setError("Unable to load users")
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return users.map((user) => (
    <p key={user.id}>{user.name}</p>
  ))
}
```

Visual:

```text
Component calls API
  |
  v
Request interceptor adds token
  |
  v
Backend API
  |
  v
Response interceptor handles errors
  |
  v
Component receives data or error
```

Auth0/interview note:

If the app uses Auth0, do not hardcode tokens manually. Get the access token from Auth0, then attach it to API calls. Depending on architecture, teams may attach it in a request interceptor, API wrapper, or query function.

Concept:

```text
React component
  |
  v
getAccessTokenSilently()
  |
  v
Axios request interceptor attaches Bearer token
  |
  v
Backend validates token
```

Important cautions:

- Do not store client secrets in React.
- Do not rely only on frontend route protection.
- Backend must validate the token.
- Be careful with refresh-token and retry loops.
- Avoid infinite retry if token refresh fails.

Resume example:

In HNB Digital Lobby and ChoicePay, centralized REST integration with Axios interceptors would help keep auth headers and error handling consistent across payment and dashboard modules.

Stablehouse-style explanation:

For Stablehouse onboarding, Axios interceptors or a centralized API client could keep authentication headers, request IDs, and global error handling consistent across POI, POA, Investor Type, Account Type, document upload, and Liveness Verification APIs.

Interview answer:

Axios interceptors allow us to centralize logic before requests and after responses. Request interceptors are useful for attaching auth tokens, request IDs, or tenant IDs. Response interceptors are useful for global error handling, such as handling `401`, `403`, or server errors. This keeps components clean because they call API functions instead of repeating auth and error-handling logic everywhere.

### Senior Level: What is a design system?

A design system is a collection of reusable UI components, design tokens, guidelines, and patterns used to build consistent products.

```text
Design System
  |
  +-- Tokens: colors, spacing, typography
  +-- Components: Button, Modal, Table, FormField
  +-- Patterns: forms, filters, onboarding steps
  +-- Documentation: Storybook
```

Example:

```tsx
<Button variant="primary" size="md">
  Continue
</Button>
```

Resume example:

In HNB Digital Lobby, you developed reusable components and shared frontend libraries. That is design-system thinking: consistent UI across modules, fewer duplicate components, and faster delivery.

Interview summary:

A design system improves consistency, accessibility, maintainability, and delivery speed across enterprise applications.

### Senior Level: How do you handle accessibility in React?

Accessibility means making UI usable with keyboards, screen readers, and assistive technologies.

Checklist:

- Use semantic HTML.
- Use labels for inputs.
- Use buttons for actions.
- Preserve focus outlines.
- Add `aria-*` only when needed.
- Use `role="alert"` for important dynamic errors.
- Support keyboard navigation.
- Test color contrast.

Example:

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
{error && <p role="alert">{error}</p>}
```

Interview summary:

I start with semantic HTML, then add ARIA only when needed. Accessibility should be part of component design, not a final patch.

### Senior Level: How do you handle CI/CD for React?

A React CI/CD pipeline usually installs dependencies, runs quality checks, builds the app, and deploys artifacts.

```text
Developer pushes code
  |
  v
CI starts
  |
  +-- npm install
  +-- lint
  +-- unit tests
  +-- build
  +-- static analysis
  |
  v
Deploy to environment
```

Example commands:

```bash
npm ci
npm run lint
npm test
npm run build
```

Resume example:

In HNB Digital Lobby, you configured and maintained Jenkins CI/CD pipelines. You can explain that CI/CD helped automate build, test, and deployment workflows, making releases faster and more reliable.

### Senior Level: How do you review frontend PRs?

In a frontend PR review, check correctness, maintainability, accessibility, performance, and test coverage.

Checklist:

- Does the code solve the requirement?
- Are components small and readable?
- Is state placed correctly?
- Are API errors handled?
- Are loading and empty states handled?
- Are types clear?
- Are tests meaningful?
- Does UI match Figma?
- Are accessibility basics covered?
- Is there unnecessary re-rendering or bundle impact?

Resume example:

In Stablehouse, you participated in PR reviews, SonarQube checks, and code quality improvements. A strong answer is that you review not only syntax, but also user flow, API behavior, accessibility, and maintainability.

### Senior Level: How do you explain your project architecture in an interview?

Use this structure:

```text
1. Business context
2. Your role
3. Tech stack
4. Architecture
5. APIs and state
6. Performance/testing
7. Impact
```

Stablehouse example:

```text
I worked on a FinTech onboarding platform.
The modules included POI, POA, Investor Type, Account Type, and Liveness Verification.
I used React, TypeScript, GraphQL, reusable components, and unit tests.
The architecture separated onboarding features, shared upload components, API operations, and typed models.
For document upload and onboarding submission, GraphQL mutations were organized by feature.
We focused on maintainability, accessibility, and stable enterprise delivery.
```

HNB Digital Lobby example:

```text
I worked on migrating a Digital Lobby application from Angular to React.
I built reusable components and shared frontend libraries.
I integrated REST APIs using Axios and React hooks.
State was managed with hooks, Context API, and Redux depending on scope.
We improved performance using React Profiler and lazy loading.
Jenkins CI/CD automated build, test, and deployment workflows.
```

Interview summary:

When explaining architecture, do not only list technologies. Explain the business problem, how the app was structured, how data flowed, how quality was maintained, and what impact your work had.

## Missing Must-Revise Interview Questions

This section covers important questions from the checklist that were not already explained deeply above.

### Tell me about your React experience

Use a structured answer:

```text
1. Total experience
2. React-specific experience
3. Project domain
4. Tech stack
5. Your responsibilities
6. Impact
```

Resume-based answer:

I have 10+ years of frontend development experience and around 5 years specializing in React.js, TypeScript, JavaScript ES6+, API integration, performance optimization, and enterprise UI development. In my current Stablehouse project, I work on FinTech onboarding modules like POI, POA, Investor Type, Account Type, and Liveness Verification using React, TypeScript, and GraphQL. Previously, in HNB Digital Lobby, I helped migrate an Angular application to React, built reusable components, integrated REST APIs, used Redux and Context API, optimized performance with React Profiler and lazy loading, and worked with Jenkins CI/CD.

### Why React?

React is popular because it gives a component-based model, predictable one-way data flow, strong ecosystem, good performance patterns, and excellent community support.

```text
React strengths
  |
  +-- Reusable components
  +-- Declarative UI
  +-- One-way data flow
  +-- Large ecosystem
  +-- Strong TypeScript support
  +-- Works with many architectures
```

Interview answer:

I prefer React because it helps build scalable, reusable UI through components. Its ecosystem supports routing, state management, testing, forms, performance optimization, and enterprise architecture.

### Explain the Diffing Algorithm

React's diffing algorithm compares the previous Virtual DOM tree with the new Virtual DOM tree to find what changed.

React uses practical assumptions:

- Different element types create different trees.
- Keys help React match list items.
- Same type and same key usually preserve component state.

Diagram:

```text
Old tree                New tree
--------                --------
<ul>                    <ul>
  <li key="a" />          <li key="b" />
  <li key="b" />          <li key="a" />
</ul>                   </ul>

React uses keys to detect reorder instead of recreating all items.
```

Interview summary:

Diffing is how React compares old and new UI trees. Keys make diffing accurate for lists.

### How does React identify which components need re-rendering?

React re-renders when:

- State changes.
- Parent re-renders.
- Props change.
- Consumed context value changes.
- External store subscription changes.

```text
setState
  |
  v
Component re-renders
  |
  v
Children may also re-render
  |
  v
React compares output and commits DOM changes if needed
```

Important point:

A component re-render does not always mean the real DOM changes. React may render and then decide no DOM update is needed.

### Redux Flow

Redux uses a predictable one-way flow.

```text
UI event
  |
  v
dispatch(action)
  |
  v
reducer(previousState, action)
  |
  v
new state in store
  |
  v
UI re-renders from selected state
```

Example:

```ts
dispatch({ type: 'cart/addItem', payload: product })
```

Reducer:

```ts
function cartReducer(state, action) {
  if (action.type === 'cart/addItem') {
    return {
      ...state,
      items: [...state.items, action.payload],
    }
  }

  return state
}
```

### Redux Toolkit

Redux Toolkit is the recommended way to write Redux. It reduces boilerplate and includes utilities like `configureStore`, `createSlice`, `createAsyncThunk`, and RTK Query.

Example:

```ts
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
  },
})
```

Why mutation syntax works:

Redux Toolkit uses Immer internally, so the code looks mutable but produces immutable updates.

### Redux Middleware

Middleware sits between dispatching an action and the reducer.

```text
dispatch(action)
  |
  v
middleware
  |
  v
reducer
  |
  v
store update
```

Use cases:

- Logging.
- Async API calls.
- Analytics.
- Error reporting.
- Auth token refresh.

### Redux Thunk

Redux Thunk lets action creators return functions instead of plain objects. This is useful for async logic.

```ts
function fetchUser() {
  return async (dispatch) => {
    dispatch({ type: 'user/loading' })
    const user = await api.getUser()
    dispatch({ type: 'user/success', payload: user })
  }
}
```

Interview answer:

Thunk is simpler and good for many async flows. For complex orchestration, teams sometimes use Redux Saga.

### Redux Thunk vs Redux Saga

```text
Redux Thunk
  |
  +-- Function-based async logic
  +-- Easier to learn
  +-- Good for simple API calls

Redux Saga
  |
  +-- Generator-based side effects
  +-- Better for complex workflows
  +-- Good for cancellation, retries, orchestration
```

Interview summary:

Thunk is simpler. Saga is more powerful for complex side-effect flows, but adds learning and maintenance cost.

### BrowserRouter vs HashRouter

`BrowserRouter` uses clean URLs and the HTML5 history API.

```text
https://example.com/dashboard
```

`HashRouter` stores routing after `#`.

```text
https://example.com/#/dashboard
```

Comparison:

```text
BrowserRouter
  |
  +-- Clean URLs
  +-- Needs server fallback to index.html

HashRouter
  |
  +-- Works without server route config
  +-- Less clean URLs
```

Use `BrowserRouter` for modern production apps when server fallback is configured.

### Lazy Loading Routes

Lazy loading routes reduces initial bundle size by loading route code only when needed.

```tsx
const Dashboard = lazy(() => import('./Dashboard'))

<Route
  path="/dashboard"
  element={
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  }
/>
```

Diagram:

```text
Initial app load
  |
  v
Do not load Dashboard yet
  |
  v
User visits /dashboard
  |
  v
Load dashboard chunk
```

### React Hook Form vs Formik

Both are form libraries, but they have different styles.

```text
React Hook Form
  |
  +-- Uncontrolled-first
  +-- Fewer re-renders
  +-- Good performance for large forms

Formik
  |
  +-- Controlled state model
  +-- Familiar and mature
  +-- Can re-render more in large forms
```

Interview answer:

For large forms, I usually prefer React Hook Form because it is performant and has less boilerplate. Formik is still common in older projects and works well, but React Hook Form is often lighter for modern React apps.

### Axios vs Fetch

`fetch` is built into the browser. Axios is a library with extra conveniences.

```text
fetch
  |
  +-- Native browser API
  +-- Requires manual JSON/error handling

Axios
  |
  +-- Automatic JSON parsing
  +-- Request/response interceptors
  +-- Easier timeout and global config
```

Fetch example:

```ts
const response = await fetch('/api/users')
if (!response.ok) throw new Error('Failed')
const data = await response.json()
```

Axios example:

```ts
const response = await axios.get('/api/users')
const data = response.data
```

### Retry Mechanism

Retry means calling a failed API again, usually for temporary failures.

```text
API call fails
  |
  v
Retry after delay
  |
  +-- success --> show data
  |
  +-- fails again --> retry or show error
```

Simple retry:

```ts
async function fetchWithRetry(url: string, retries = 3) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Request failed')
    return response.json()
  } catch (error) {
    if (retries === 0) throw error
    return fetchWithRetry(url, retries - 1)
  }
}
```

In production, query libraries can handle retries automatically.

### React Query: Query Keys

Query keys identify cached server data.

```tsx
useQuery({
  queryKey: ['transactions', page],
  queryFn: () => fetchTransactions(page),
})
```

Cache:

```text
['transactions', 1] -> page 1 data
['transactions', 2] -> page 2 data
```

Good query keys should include all variables that affect the result.

### React Query: staleTime and gcTime

`staleTime` controls how long data is considered fresh.

`gcTime` controls how long inactive cached data stays in memory before garbage collection.

```text
staleTime
  |
  v
How long data is fresh

gcTime
  |
  v
How long unused cached data remains stored
```

Example:

```tsx
useQuery({
  queryKey: ['transactions', page],
  queryFn: () => fetchTransactions(page),
  staleTime: 60_000,
  gcTime: 5 * 60_000,
})
```

Meaning:

```text
For 1 minute: data is fresh
For 5 minutes inactive: data remains in cache
After that: cache can be garbage collected
```

### React Query: What happens when user navigates between pages?

If cached data exists, React Query can show it immediately instead of refetching from scratch.

```text
Visit page 1
  |
  v
Fetch and cache ['transactions', 1]

Visit page 2
  |
  v
Fetch and cache ['transactions', 2]

Go back to page 1
  |
  v
Show cached page 1 quickly
```

### React Query: Prefetch next page

Prefetch means loading data before the user asks for it.

```tsx
queryClient.prefetchQuery({
  queryKey: ['transactions', page + 1],
  queryFn: () => fetchTransactions(page + 1),
})
```

Diagram:

```text
User is on page 1
  |
  v
App prefetches page 2
  |
  v
User clicks Next
  |
  v
Page 2 appears faster from cache
```

### React Query Pagination

Use page number in the query key.

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['transactions', page],
  queryFn: () => fetchTransactions(page),
})
```

Each page has its own cache entry.

### Infinite Scrolling using React Query

Use `useInfiniteQuery` for loading pages progressively.

```tsx
const query = useInfiniteQuery({
  queryKey: ['transactions'],
  queryFn: ({ pageParam }) => fetchTransactions(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextPage,
})
```

Flow:

```text
Load first page
  |
  v
User reaches bottom
  |
  v
fetchNextPage()
  |
  v
Append next page results
```

### React 19: Actions API and Form Actions

React 19 improves async action and form workflows, especially in frameworks.

Conceptually, an action represents async work triggered by a form or interaction.

```tsx
async function submitForm(formData: FormData) {
  const name = formData.get('name')
  await saveUser(name)
}

function Form() {
  return (
    <form action={submitForm}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

Interview answer:

Actions make async form submission more integrated with React's rendering model, especially with frameworks that support server actions.

### React 19: `use()` hook

The `use()` hook can read values from promises or context in supported React environments.

Conceptual example:

```tsx
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return <p>{user.name}</p>
}
```

Important:

`use()` is not a replacement for every `useEffect`. It is mainly used in Suspense-enabled patterns and framework-supported environments.

### React 19: `useOptimistic`

`useOptimistic` helps show an optimistic UI while an async action is pending.

Concept:

```text
User clicks Like
  |
  v
UI immediately shows liked
  |
  v
Server confirms or fails
  |
  v
Keep UI or rollback
```

This is useful for likes, comments, follows, and low-risk updates.

### React 19: `useFormStatus`

`useFormStatus` helps child components know whether a parent form is pending.

Concept:

```tsx
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}
```

This is useful for form submit buttons that need pending state without prop drilling.

### TypeScript: Interface vs Type

Both can describe object shapes.

```ts
interface User {
  id: number
  name: string
}

type UserRole = 'admin' | 'viewer'
```

Use `interface` often for object shapes that may be extended. Use `type` for unions, primitives, tuples, and more flexible compositions.

### TypeScript: Generics

Generics make reusable code type-safe.

```ts
function getFirstItem<T>(items: T[]): T {
  return items[0]
}

const firstNumber = getFirstItem([1, 2, 3])
const firstName = getFirstItem(['Asha', 'Rohan'])
```

React example:

```tsx
type SelectProps<T> = {
  items: T[]
  onSelect: (item: T) => void
}
```

### TypeScript: Utility Types

Common utility types:

```ts
Partial<User>       // all fields optional
Pick<User, 'id'>    // only id
Omit<User, 'id'>    // everything except id
Record<Role, string[]> // map roles to permissions
```

Example:

```ts
type UpdateUserInput = Partial<User>
type UserPreview = Pick<User, 'id' | 'name'>
```

### TypeScript: Props, Event, and API Response Typing

Props:

```tsx
type ButtonProps = {
  label: string
  onClick: () => void
}
```

Event:

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value)
}
```

API response:

```ts
type OnboardingStatus = {
  currentStep: 'POI' | 'POA' | 'LIVENESS' | 'COMPLETE'
  poiStatus: 'pending' | 'approved' | 'rejected'
}
```

### Jest basics

Jest is a JavaScript testing framework used for assertions, test runners, mocks, spies, and coverage reports. In React projects, Jest is commonly paired with React Testing Library.

Common Jest concepts:

- `test` or `it`: defines a test case.
- `expect`: checks the result.
- `describe`: groups related tests.
- `jest.fn()`: creates a mock function.
- `jest.mock()`: mocks a module.

Example:

```ts
function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
}

test("returns full name", () => {
  expect(getFullName("Karteek", "Kesav")).toBe("Karteek Kesav")
})
```

Interview summary:

Jest is used to test JavaScript and TypeScript logic, mock dependencies, and verify expected behavior.

### React Testing Library

React Testing Library tests components from the user's point of view. Instead of checking internal state, it checks what the user can see and do.

Diagram:

```text
User action
   |
   v
React Testing Library
   |
   v
Rendered component
   |
   v
Assert visible behavior
```

Example:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

test("increments count", async () => {
  render(<Counter />)

  await userEvent.click(screen.getByRole("button", { name: "Increment" }))

  expect(screen.getByText("Count: 1")).toBeInTheDocument()
})
```

Interview summary:

React Testing Library encourages testing behavior, accessibility, and user flows instead of implementation details.

### Mock API

Mocking APIs means replacing real network calls with controlled fake responses during tests. This makes tests fast, stable, and independent of backend availability.

Diagram:

```text
Component test
   |
   v
Mock API response
   |
   v
Loading -> Success / Error UI
```

Example idea with MSW:

```ts
http.get("/api/profile", () => {
  return HttpResponse.json({ name: "Karteek" })
})
```

What to test:

- Loading state appears first.
- Success data is rendered.
- Error message appears when API fails.
- Retry button calls the API again.

Interview summary:

For React API tests, I prefer mocking at the network boundary using MSW because the component still behaves like it is calling a real API.

### Snapshot Testing

Snapshot testing saves rendered output and compares future test output against it.

Useful for:

- Stable presentational components.
- Detecting unexpected UI markup changes.

Risk:

Snapshots can become noisy if overused. Prefer behavior tests for interactive components.

### Unit Testing Hooks

Custom hooks can be tested by rendering a small test component or using hook testing utilities.

Example custom hook:

```tsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = () => setValue((current) => !current)

  return { value, toggle }
}
```

What to test:

- Initial value.
- State changes after calling `toggle`.
- Edge cases.

### Scenario: Search with debounce, cancellation, loading, error, and cache

Flow:

```text
User types "kar"
  |
  v
Debounce waits 300ms
  |
  v
Cancel previous request
  |
  v
Show loading
  |
  v
Fetch results
  |
  +-- success --> cache and show results
  |
  +-- error ----> show error and retry
```

Implementation pieces:

- `useState` for input.
- `useEffect` for debounce.
- `AbortController` for cancellation.
- Query library for caching.
- Error UI and empty UI.

### Scenario: Large banking transactions table

For one year of transactions, do not render everything at once.

Architecture:

```text
Backend pagination
  |
  v
React Query cache per page
  |
  v
Virtualized table rows
  |
  v
Filters/search in URL params
```

Best answer:

I would use server-side pagination or cursor pagination, cache pages by query key, virtualize visible rows, and keep filters in URL search params so the view is shareable.

### Scenario: Dashboard with multiple widgets, one API fails

Each widget should be independent.

```text
Dashboard
  |
  +-- BalanceWidget ---- API success
  +-- TransactionsWidget - API fails
  +-- AlertsWidget ------ API success
```

If one API fails, only that widget should show an error. The full dashboard should not crash.

Use:

- Independent queries.
- Widget-level loading/error states.
- Error Boundaries around risky widgets.
- Retry for recoverable errors.
- Skeleton loaders.

### Scenario: Document upload in onboarding

Stablehouse-style flow:

```text
Select Passport file
  |
  v
Validate file type and size
  |
  v
Show preview/file name
  |
  v
Upload through GraphQL mutation
  |
  v
Show loading/progress
  |
  +-- success --> invalidate onboarding status
  |
  +-- failure --> show retry/error
```

Important checks:

- File type.
- File size.
- Upload progress.
- Retry.
- Backend validation.
- Session expiration.

### Scenario: Like button with optimistic UI

```text
User clicks Like
  |
  v
Immediately update UI to liked
  |
  v
Send request to server
  |
  +-- success --> keep liked
  |
  +-- failure --> rollback and show error
```

Example:

```tsx
setLiked(true)

try {
  await likePost(postId)
} catch {
  setLiked(false)
  setError('Could not like post')
}
```

### Scenario: Dashboard has 20 modules. How do you reduce bundle size?

Use:

- Route-level lazy loading.
- Component-level lazy loading for heavy modules.
- Dynamic imports.
- Bundle analysis.
- Remove unused dependencies.
- Tree shaking.
- Split vendor chunks.

Diagram:

```text
Initial bundle
  |
  +-- Core shell
  +-- Auth
  +-- Navigation

Lazy chunks
  |
  +-- Reports module
  +-- Analytics module
  +-- Admin module
```

### Scenario: Large dashboard images slow loading

Optimize images with:

- Correct image dimensions.
- WebP/AVIF formats.
- Lazy loading below-the-fold images.
- Responsive `srcset`.
- CDN optimization.
- Compression.
- Avoiding layout shift with width/height.

Example:

```tsx
<img
  src="/dashboard.webp"
  width="800"
  height="400"
  loading="lazy"
  alt="Dashboard preview"
/>
```

### Leadership: How do you mentor junior developers?

Answer with examples:

- Explain requirements clearly.
- Pair program on tricky issues.
- Review PRs with constructive comments.
- Share reusable patterns.
- Encourage testing and debugging habits.
- Help them understand why, not just what.

Resume connection:

With 10+ years of frontend experience and enterprise delivery experience at ValueLabs and Virtusa, you can position yourself as someone who helps juniors with component design, API integration, debugging, and code quality.

### Leadership: How do you estimate tasks?

I break the task into smaller parts:

```text
Requirement analysis
  |
  v
UI changes
  |
  v
API integration
  |
  v
State management
  |
  v
Validation/error states
  |
  v
Testing
  |
  v
Code review fixes
```

Then I consider complexity, dependencies, unknowns, and testing effort.

### Leadership: How do you handle production issues?

Process:

```text
Identify impact
  |
  v
Reproduce issue
  |
  v
Check logs/monitoring
  |
  v
Find root cause
  |
  v
Hotfix or rollback
  |
  v
Add regression test
  |
  v
Document learning
```

Resume connection:

Your Cisco experience mentions bottleneck analysis, performance logs, and high uptime. Use that as an example of production-focused debugging.

### Coding: Debounce implementation

```ts
function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  let timerId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), delay)
  }
}
```

Use case:

Search API after user stops typing.

### Coding: Throttle implementation

```ts
function throttle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      callback(...args)
    }
  }
}
```

Use case:

Scroll, resize, mouse move, or repeated button actions.

### Coding: Flatten nested array

```ts
function flattenArray(input: unknown[]): unknown[] {
  return input.reduce<unknown[]>((result, item) => {
    if (Array.isArray(item)) {
      return [...result, ...flattenArray(item)]
    }

    return [...result, item]
  }, [])
}
```

### Coding: Group array by property

```ts
function groupBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
) {
  return items.reduce<Record<K, T[]>>((groups, item) => {
    const key = getKey(item)
    groups[key] = groups[key] ?? []
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}
```

### Coding: Remove duplicates

```ts
function removeDuplicates<T>(items: T[]) {
  return [...new Set(items)]
}
```

For objects:

```ts
function uniqueById<T extends { id: string | number }>(items: T[]) {
  const map = new Map(items.map((item) => [item.id, item]))
  return [...map.values()]
}
```

### Coding: Two Sum

```ts
function twoSum(numbers: number[], target: number) {
  const seen = new Map<number, number>()

  for (let index = 0; index < numbers.length; index += 1) {
    const complement = target - numbers[index]

    if (seen.has(complement)) {
      return [seen.get(complement), index]
    }

    seen.set(numbers[index], index)
  }

  return []
}
```

Time complexity: `O(n)`.

### Coding: Basic LRU Cache idea

LRU means Least Recently Used. When the cache is full, remove the item that has not been used recently.

```text
Cache capacity = 3

Use A -> [A]
Use B -> [A, B]
Use C -> [A, B, C]
Use A -> [B, C, A]
Use D -> [C, A, D]  // B removed
```

In JavaScript, `Map` helps because it preserves insertion order.

## Auth0 Login In React

Auth0 is an identity platform used to handle login, logout, signup, enterprise SSO, MFA, sessions, and token issuance. In React applications, Auth0 is commonly integrated using the official React SDK with `Auth0Provider` and `useAuth0`.

This topic is very useful for your interviews because your latest Stablehouse FinTech project used Auth0. It connects directly with secure onboarding flows like POI, POA, Investor Type, Account Type, document upload, and Liveness Verification.

### Resume-Based Interview Answer

You can explain it like this:

In my latest FinTech project, we used Auth0 for authentication. In React, Auth0 was integrated by wrapping the app with `Auth0Provider` and using `useAuth0` inside components for login, logout, authenticated user details, loading state, and token access. For protected onboarding flows like POI, POA, and Liveness Verification, authentication ensured only valid users could access sensitive screens. For protected APIs, the frontend requested an access token and sent it as a Bearer token, while backend services validated the token, issuer, audience, expiration, and permissions.

### Auth0 Login Flow

Diagram:

```text
React App
  |
  | user clicks Login
  v
loginWithRedirect()
  |
  v
Auth0 Universal Login
  |
  | user authenticates
  v
Redirect back to React App
  |
  v
Auth0Provider restores auth state
  |
  +-- isAuthenticated
  +-- user profile
  +-- getAccessTokenSilently()
```

### Setup In A React App

Install SDK:

```bash
npm install @auth0/auth0-react
```

Create Auth0 Single Page Application in Auth0 dashboard and configure:

```text
Allowed Callback URL: http://localhost:5173
Allowed Logout URL:   http://localhost:5173
Allowed Web Origins:  http://localhost:5173
```

Vite environment variables:

```env
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-spa-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

Important interview point:

`VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` are safe to expose because a React SPA is a public client. Never store an Auth0 client secret in frontend code.

### Auth0Provider

`Auth0Provider` makes Auth0 state available to the React component tree.

```tsx
import { Auth0Provider } from "@auth0/auth0-react"

<Auth0Provider
  domain={domain}
  clientId={clientId}
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience,
  }}
  useRefreshTokens
  cacheLocation="memory"
>
  <App />
</Auth0Provider>
```

Interview explanation:

The provider handles redirect callback processing, restores session state, renews tokens when configured, and exposes authentication data through React context.

In this repository, the app is protected at the shell level:

```text
Not authenticated -> Auth0 login page
Authenticated ----> Full topics dashboard
Logout -----------> Auth0 logout -> Login page
```

### Refresh Tokens In Auth0

Refresh tokens are used to get new access tokens without forcing the user to log in again.

Auth0 dashboard requirement:

Enable **Refresh Token Rotation** for the Single Page Application.

React SDK setup:

```tsx
<Auth0Provider useRefreshTokens cacheLocation="memory">
  <App />
</Auth0Provider>
```

Interview explanation:

Access tokens usually expire quickly. The refresh token lets the SDK request a new access token silently. For SPAs, refresh tokens must be handled carefully because browser code is public. Keeping tokens in memory is safer, while local storage persists across reloads but has more XSS risk.

How to check token refresh in this repository:

Use the **Auth0 Login** topic and click **Inspect tokens**.

The example shows:

- access token preview
- issued-at time from `iat`
- expiry time from `exp`
- ID token claims
- whether a later token request returned a different token preview

Important interview point:

We do not refresh tokens using our own `setInterval`. The app calls `getAccessTokenSilently()` when it needs a token. The Auth0 SDK decides whether the existing access token is still valid or whether it should use the refresh-token/session flow to obtain a new token.

Diagram:

```text
Protected API call needs token
        |
        v
getAccessTokenSilently()
        |
        +-- valid token exists -> return it
        |
        +-- token expired / near expiry -> use Auth0 refresh flow
        |
        v
Send Authorization: Bearer token
```

### Login, Logout, And Profile

```tsx
import { useAuth0 } from "@auth0/auth0-react"

function LoginPanel() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0()

  if (isLoading) return <p>Checking session...</p>

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Login</button>
  }

  return (
    <>
      <p>Welcome {user?.name}</p>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Logout
      </button>
    </>
  )
}
```

### Protected API Calls

For protected backend APIs, use an access token.

```tsx
const { getAccessTokenSilently } = useAuth0()

async function loadOnboardingStatus() {
  const token = await getAccessTokenSilently()

  const response = await fetch("/api/onboarding/status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}
```

Diagram:

```text
React App
  |
  | getAccessTokenSilently()
  v
Auth0
  |
  | access token
  v
React App
  |
  | Authorization: Bearer token
  v
Backend API
  |
  | validates token
  v
Protected data
```

Interview explanation:

The frontend does not decide final security. It sends the token. The backend validates the token and decides whether the user is allowed to access the resource.

### ID Token Vs Access Token

| Token | Purpose | Used by |
| --- | --- | --- |
| ID token | Proves who the user is and contains profile claims | React client |
| Access token | Authorizes access to APIs | Backend APIs |

Simple explanation:

Use the ID token to know the logged-in user's identity. Use the access token to call protected APIs.

### Authentication Vs Authorization

Authentication asks:

Who is the user?

Authorization asks:

What is the user allowed to access?

Stablehouse example:

A user may be authenticated in Auth0, but only users with correct onboarding permissions should access sensitive POI, POA, or Liveness Verification screens.

### Protected Routes

Frontend protected routes improve user experience by redirecting unauthenticated users.

```tsx
function ProtectedContent() {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Login to continue</button>
  }

  return <OnboardingDashboard />
}
```

Important:

Frontend route protection is not enough for security. Backend APIs must validate tokens.

### Common Interview Questions

Why use Auth0?

Auth0 provides secure authentication flows, Universal Login, social login, enterprise SSO, MFA, session handling, and token issuance. It reduces the risk of building authentication incorrectly.

What is Universal Login?

Universal Login is Auth0-hosted login. The user leaves the app, authenticates with Auth0, and then returns to the app through the configured callback URL.

What should never be stored in React?

Client secrets, private keys, backend credentials, and database passwords should never be stored in React. React code runs in the browser and is visible to users.

How do you call protected APIs?

Use `getAccessTokenSilently`, send the token in the `Authorization` header, and let the backend validate it.

What happens after logout?

Auth0 clears the session and redirects the user to the configured logout return URL.

### Common Mistakes

- Putting client secret in frontend `.env`.
- Forgetting callback/logout/web origin URLs in Auth0 dashboard.
- Using ID token to call APIs instead of access token.
- Protecting only frontend routes and not backend APIs.
- Forgetting to enable Refresh Token Rotation when refresh tokens are required.
- Not handling loading and error states.
- Not explaining token validation in interviews.

### Quick Interview Summary

Auth0 handles authentication. React integrates Auth0 through `Auth0Provider` and `useAuth0`. The user logs in through Auth0 Universal Login, returns to the app, and React receives authentication state. For APIs, the frontend gets an access token and sends it as a Bearer token. The backend validates that token. In my Stablehouse onboarding project, this pattern fits secure access to POI, POA, document upload, and Liveness Verification flows.

## Real-Time Communication In React

This topic is important for senior React interviews because many enterprise applications need more than a simple `fetch()` call. In your resume, the best project to connect with this topic is **Stablehouse FinTech onboarding**, especially POI, POA, document upload, onboarding submission, dynamic screen rendering, and Liveness Verification.

Resume-based interview framing:

```text
Stablehouse onboarding
  |
  +-- Request-response -> submit onboarding, upload documents, fetch screens
  +-- Polling ---------> check verification status if backend has no push
  +-- Long polling ----> wait for KYC/liveness update with fewer repeated calls
  +-- SSE -------------> server pushes onboarding status updates
  +-- WebSocket -------> live admin review dashboard or two-way notifications
```

Strong interview answer:

In my Stablehouse FinTech onboarding work, request-response GraphQL APIs fit normal flows like document upload, onboarding submission, and dynamic screen rendering. For status-driven flows like POI, POA, or Liveness Verification, the frontend may need updates after submission. If the backend only exposes status APIs, I would use polling with cleanup and retry handling. If the backend supports server push, I would prefer SSE for one-way status updates. If the product needs two-way real-time communication, such as live notifications or admin review dashboards, I would use WebSockets.

### Request-Response Cycle

Request-response is the standard communication pattern used by REST and GraphQL APIs. The client sends a request, the server processes it, and the server returns a response.

Diagram:

```text
React client                  Server
    |                            |
    | ---- GraphQL/REST call --> |
    |                            |
    | <-- response data -------- |
    |                            |
```

Example:

```tsx
async function uploadPoiDocument(file: File) {
  const formData = new FormData()
  formData.append("document", file)

  const response = await fetch("/api/onboarding/poi", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Document upload failed")
  }

  return response.json()
}
```

Where it fits in your resume:

- Stablehouse document upload
- onboarding submission
- dynamic screen rendering
- HNB Digital Lobby REST API integration
- normal dashboard data fetches

Limitation:

Request-response does not automatically tell the UI when server-side status changes later. For example, after a liveness verification upload, the backend may process the result asynchronously. The UI needs another strategy to know when the status changes.

Interview summary:

Request-response is best for normal API operations where the client asks once and gets one response. It is not enough by itself for real-time status updates.

### Short Polling

Short polling means the client repeatedly asks the server for updates at a fixed interval.

Diagram:

```text
React client                  Server
    | ---- status request ---> |
    | <--- current status ---- |
    |
    | wait 5 seconds
    |
    | ---- status request ---> |
    | <--- current status ---- |
```

Example:

```tsx
useEffect(() => {
  const intervalId = window.setInterval(async () => {
    const status = await getVerificationStatus(userId)
    setVerificationStatus(status)
  }, 5000)

  return () => window.clearInterval(intervalId)
}, [userId])
```

Where it fits in your resume:

In Stablehouse onboarding, after a user uploads POI or POA documents, the frontend can poll the verification status until it becomes `approved`, `rejected`, or `retry_required`.

Pros:

- Simple to implement.
- Works with normal REST or GraphQL APIs.
- Does not need special backend infrastructure.

Cons:

- Can send unnecessary requests.
- Updates are not instant.
- Needs cleanup to avoid memory leaks.

Interview summary:

Short polling is useful when the backend does not support real-time push and status updates are not extremely frequent.

### Long Polling

Long polling means the client sends a request and the server keeps that request open until it has new data or the request times out. After receiving a response, the client sends the next request.

Diagram:

```text
React client                  Server
    | ---- wait for update --> |
    |                          | holds request
    | <--- update available -- |
    | ---- next request -----> |
```

Example:

```tsx
useEffect(() => {
  let isActive = true

  async function listenForStatus() {
    while (isActive) {
      const update = await waitForVerificationUpdate(userId)

      if (isActive) {
        setVerificationStatus(update.status)
      }
    }
  }

  listenForStatus()

  return () => {
    isActive = false
  }
}, [userId])
```

Where it fits in your resume:

Long polling can fit a KYC or liveness verification status flow where updates are not very frequent, but the UI should update faster than fixed interval polling.

Pros:

- Fewer unnecessary responses than short polling.
- Works over HTTP.
- Good when updates are occasional.

Cons:

- Still creates repeated HTTP requests.
- Backend must support holding the request.
- More complex than short polling.

Interview summary:

Long polling is a middle ground between normal polling and real push-based communication.

### Server-Sent Events SSE

Server-Sent Events allow the server to push updates to the client over a long-lived HTTP connection. SSE is one-way: server to client.

Diagram:

```text
React client opens EventSource
    |
    v
Server keeps HTTP connection open
    |
    v
Server pushes status events
```

Example:

```tsx
useEffect(() => {
  const events = new EventSource(`/api/onboarding/${userId}/events`)

  events.onmessage = (event) => {
    const update = JSON.parse(event.data)
    setVerificationStatus(update.status)
  }

  events.onerror = () => {
    events.close()
  }

  return () => events.close()
}, [userId])
```

Where it fits in your resume:

SSE is a good fit for Stablehouse onboarding status updates:

- `DOCUMENT_UPLOADED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `RETRY_REQUIRED`

Pros:

- Simpler than WebSocket for one-way updates.
- Uses HTTP.
- Browser has built-in `EventSource`.
- Good for notification feeds and status streams.

Cons:

- Server-to-client only.
- Not ideal when the client must send frequent real-time messages back.
- Needs reconnect/error handling.

Interview summary:

SSE is best when the server needs to push updates and the client mostly listens.

### WebSockets

WebSockets create a persistent two-way connection between client and server. Both sides can send messages at any time.

Diagram:

```text
React client <==== persistent socket ====> Server

Client can send messages.
Server can send messages.
```

Example:

```tsx
useEffect(() => {
  const socket = new WebSocket("wss://example.com/onboarding")

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "subscribe", userId }))
  }

  socket.onmessage = (event) => {
    const update = JSON.parse(event.data)
    setVerificationStatus(update.status)
  }

  socket.onerror = () => {
    console.error("Socket connection failed")
  }

  return () => socket.close()
}, [userId])
```

Where it fits in your resume:

WebSockets would be useful if Stablehouse had:

- live compliance review dashboard
- real-time user notifications
- admin review queue updates
- live session or liveness monitoring

For HNB Digital Lobby, WebSockets could fit live branch/customer workflow dashboards or real-time operational updates.

Pros:

- True two-way real-time communication.
- Low latency after connection is established.
- Good for frequent live updates.

Cons:

- More infrastructure complexity.
- Needs reconnect handling.
- Needs heartbeat/ping strategy.
- Needs authentication and authorization on the socket connection.

Interview summary:

WebSocket is the best option when both client and server need to communicate in real time.

### Comparison Table

| Pattern | Direction | Connection | Best use case |
| --- | --- | --- | --- |
| Request-response | Client asks, server replies | Short-lived | Form submit, document upload, normal REST/GraphQL calls |
| Short polling | Client repeatedly asks | Repeated short requests | Simple status checks |
| Long polling | Client asks, server waits | Held HTTP request | Infrequent updates where faster status is needed |
| SSE | Server pushes to client | Long-lived HTTP | Onboarding status, notifications, audit stream |
| WebSocket | Two-way | Persistent socket | Chat, live dashboards, trading data, admin review updates |

### How to choose in interviews

Use this decision flow:

```text
Do I need updates after initial response?
  |
  +-- No -> Request-response
  |
  +-- Yes
       |
       +-- Backend only has status API -> Short polling
       |
       +-- Backend can hold request -> Long polling
       |
       +-- Server only pushes updates -> SSE
       |
       +-- Client and server both send live messages -> WebSocket
```

### Common Interview Questions

What is the limitation of request-response?

The client receives data only when it asks. If server state changes later, the UI will not know unless it asks again or the server pushes an update.

Short polling vs long polling?

Short polling sends repeated requests at fixed intervals. Long polling sends a request and the server waits until it has an update before responding.

SSE vs WebSocket?

SSE is one-way from server to client and works over HTTP. WebSocket is two-way and uses a persistent socket connection.

When would you use polling instead of WebSocket?

Use polling when updates are simple, not extremely frequent, and the backend already exposes a normal status API.

How do you avoid memory leaks in React?

Clean up timers with `clearInterval`, close `EventSource`, close WebSocket connections, and avoid setting state after the component unmounts.

How would you explain this using your Stablehouse project?

I used request-response GraphQL APIs for onboarding operations like document upload and form submission. For status-based flows like POI, POA, or Liveness Verification, I would choose polling if backend supports only status APIs, SSE if server can push one-way updates, and WebSockets if the product requires two-way real-time communication like live admin review dashboards.

## Last-Minute Checklist

- Explain data flow: parent to child through props, child to parent through callbacks.
- Mention loading, error, empty, and success states for API questions.
- Use stable IDs for keys.
- Keep state local unless sharing is needed.
- Do not mutate state directly.
- Effects are for external synchronization, not normal derived values.
- Use backend validation and authorization for security.
- Measure performance before optimizing.
- Test user behavior, not implementation details.
- For production topics, explain tradeoffs instead of naming one tool as the answer.
