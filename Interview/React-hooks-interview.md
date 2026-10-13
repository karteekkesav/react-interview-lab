# React Hooks Interview Notes

Purpose: quick interview revision with simple JavaScript examples.

## What Are Hooks?

Hooks are functions that let function components use React features such as state, effects, refs, context, memoization, reducers, and concurrent rendering helpers.

Common hooks:

- `useState`
- `useEffect`
- `useRef`
- `useMemo`
- `useCallback`
- `useReducer`
- `useContext`
- `useTransition`
- `useDeferredValue`
- custom hooks

Interview answer:

Hooks let function components manage state, run side effects, access refs, consume context, and reuse stateful logic without class components.

## Rules Of Hooks

Rules:

- Call hooks only at the top level.
- Do not call hooks inside loops, conditions, or nested functions.
- Call hooks only from React function components or custom hooks.

Bad:

```jsx
function Profile({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState("")
  }
}
```

Good:

```jsx
function Profile({ isLoggedIn }) {
  const [name, setName] = useState("")

  if (!isLoggedIn) {
    return <p>Please login</p>
  }

  return <p>{name}</p>
}
```

Why:

React relies on hook call order to connect state and effects correctly between renders.

### Why Hooks Cannot Be Called Conditionally

Mental model: for each component instance, React associates hook state with call positions rather than variable names.

```text
First render:  Hook 1 = name state, Hook 2 = effect, Hook 3 = theme state
Next render:   Hook 1 = name state, Hook 2 = effect, Hook 3 = theme state
```

If a condition skips the first hook, every later position shifts:

```jsx
function Profile({ canEdit }) {
  if (canEdit) {
    const [draft, setDraft] = useState("") // Do not do this.
  }

  const [theme, setTheme] = useState("light")
}
```

```text
Render with canEdit=true:  Hook 1 = draft, Hook 2 = theme
Render with canEdit=false: Hook 1 = theme
```

React would read the state previously stored for `draft` as though it belonged to `theme`. Effects and their cleanup functions could also become associated with the wrong call. React therefore requires the same hooks in the same order on every render.

Move the condition inside the hook:

```jsx
function Profile({ canEdit }) {
  const [draft, setDraft] = useState("")

  useEffect(() => {
    if (!canEdit) return

    const subscription = subscribeToDraft(draft)
    return () => subscription.unsubscribe()
  }, [canEdit, draft])

  return canEdit ? <Editor value={draft} onChange={setDraft} /> : null
}
```

An early return is valid only after all hooks that must run for that component have been called consistently. Another clean option is to move the conditional behavior into a child component; when the condition is false, the whole child and its hooks are absent.

Real-time scenario: an edit screen enables autosave only for authorized users. The component still calls its hooks consistently, while the effect decides whether a subscription is needed.

Interview answer:

Hooks cannot be conditional because React maps hook state to call order. Skipping a hook shifts later positions, so React could attach state or effect cleanup to the wrong hook. I call hooks at the top level and put conditions inside them or conditionally render a child component.

## useState

`useState` stores component state.

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

Functional update:

```jsx
setCount((previousCount) => previousCount + 1)
```

Use functional update when the next state depends on the previous state.

Interview answer:

`useState` is useful for simple local state such as input values, toggles, counters, selected tabs, and small UI state.

## useEffect

`useEffect` synchronizes a component with something outside React rendering.

Common uses:

- API calls
- timers
- subscriptions
- event listeners
- localStorage
- document title

Simple example:

```jsx
import { useEffect, useState } from "react"

function CounterExample() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("useEffect ran. Count is:", count)
  }, [count])

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

Important:

```text
useEffect with [count]
= runs after first render
= runs again when count changes
```

Why it runs on first render:

React has no previous dependency value during the first mount, so it runs the effect after the first commit.

## useLayoutEffect

`useLayoutEffect` runs after React updates the DOM but before the browser paints the screen.

```jsx
import { useLayoutEffect, useRef, useState } from "react"

function Tooltip() {
  const tooltipRef = useRef(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    setHeight(tooltipRef.current.getBoundingClientRect().height)
  }, [])

  return (
    <div ref={tooltipRef}>
      Tooltip height: {height}
    </div>
  )
}
```

```text
useEffect
  |
  +-- runs after browser paint

useLayoutEffect
  |
  +-- runs before browser paint
```

Interview answer:

I use `useEffect` for most side effects. I use `useLayoutEffect` only when I must measure or update layout before the user sees the screen, such as positioning a tooltip.

Timer with cleanup:

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

Interview answer:

`useEffect` runs after React commits the render to the DOM. Cleanup runs before the effect runs again and when the component unmounts.

## useEffect And Rendering Interview Drill

### Mental Model: Render, Commit, Effect

Think of React work in three stages:

```text
Render -> Commit DOM changes -> Run effect setup
                    |
                    +-> before the next changed effect: cleanup -> new setup
                    +-> on unmount: cleanup
```

Rendering calculates what the UI should look like. Committing applies the changes to the DOM. An effect then synchronizes the committed component with an external system such as a network connection, timer, browser API, or subscription.

An effect should not normally be used to calculate values that can be derived during rendering.

### When Exactly Does An Effect Execute?

An effect executes after React commits a render. Its dependency array controls which committed renders require it to run:

```jsx
useEffect(() => {
  document.title = `Product: ${productId}`
}, [productId])
```

This effect runs after the initial commit and again after a later commit in which `productId` differs from its previous value according to `Object.is`.

Real-time scenario: a product page changes the browser title whenever navigation selects a different product. Rendering creates the new page UI; the effect synchronizes the external browser title afterward.

Interview answer:

`useEffect` runs after a render has been committed, not while React is rendering. With dependencies, it runs after the initial commit and after commits where at least one dependency changed.

### When Does The Cleanup Function Run?

Cleanup runs in two situations:

1. Before the effect is set up again because a dependency changed.
2. After the component is removed from the UI.

```jsx
useEffect(() => {
  const connection = createChatConnection(roomId)
  connection.connect()

  return () => connection.disconnect()
}, [roomId])
```

When `roomId` changes from `general` to `support`, the sequence is:

```text
disconnect from general -> connect to support
```

On unmount, React disconnects from `support`. Cleanup belongs to the particular effect setup that created it; it is not only an "unmount callback."

Real-time scenario: without cleanup, changing chat rooms could leave multiple socket connections active and cause duplicate messages or memory leaks.

### What Happens If The Dependency Array Is Missing?

The three common forms have different behavior:

```jsx
useEffect(() => {
  // Runs after every committed render.
})

useEffect(() => {
  // Runs after the initial commit.
}, [])

useEffect(() => {
  // Runs initially and whenever userId changes.
}, [userId])
```

With no dependency array, the effect is considered after every committed render. If it returns cleanup, React runs that cleanup before setting up the effect again.

An empty array means the effect does not depend on reactive values. In development Strict Mode, React may still perform an extra setup and cleanup cycle to test the effect.

### Why Can An Effect Run Twice In Development?

In development, React Strict Mode intentionally performs an extra effect cycle:

```text
setup -> cleanup -> setup
```

This stress test reveals effects that do not clean up correctly. It does not happen because the dependency array is broken, and the extra cycle does not occur in a production build.

```jsx
useEffect(() => {
  const controller = new AbortController()

  loadOrders({ signal: controller.signal })

  return () => controller.abort()
}, [])
```

Real-time scenario: if a development build opens two WebSocket connections, the effect probably needs a cleanup that closes the first connection. Removing Strict Mode hides the bug instead of fixing the effect.

Interview answer:

React Strict Mode re-runs effect setup and cleanup once in development to verify that cleanup fully reverses setup. Effects should be written so this cycle is harmless.

### How Can useEffect Create An Infinite Loop?

An infinite loop needs two conditions:

1. The effect updates state.
2. That update changes a dependency, causing the effect to run again.

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(count + 1)
  }, [count])

  return <p>{count}</p>
}
```

The loop is:

```text
effect -> setCount -> render -> count changed -> effect -> setCount -> ...
```

The correct fix depends on the intention. Do not merely remove the dependency to silence the linter.

```jsx
// Initialize state directly when no external synchronization is needed.
const [count] = useState(() => calculateInitialCount())
```

Another common loop comes from a new object or function being created on each render:

```jsx
const options = { roomId }

useEffect(() => {
  connect(options)
}, [options])
```

`options` has a new reference after every render. Prefer creating it inside the effect and depending on its primitive inputs:

```jsx
useEffect(() => {
  const options = { roomId }
  return connect(options)
}, [roomId])
```

### Why Can An Object Dependency Re-run An Effect?

React compares dependencies using `Object.is`. Objects, arrays, and functions are compared by reference, not by their contents.

```jsx
function SearchResults({ query }) {
  const filters = { query, limit: 20 }

  useEffect(() => {
    fetchResults(filters)
  }, [filters])
}
```

Every render creates a different `filters` object, so React sees a changed dependency even when `query` is unchanged.

Preferred solution:

```jsx
useEffect(() => {
  fetchResults({ query, limit: 20 })
}, [query])
```

Use `useMemo` to stabilize an object only when the object genuinely needs to exist outside the effect or is passed to a memoized child:

```jsx
const filters = useMemo(() => ({ query, limit: 20 }), [query])
```

### What Actually Causes A Component To Re-render?

A component renders initially and can render again when:

- its own state is updated to a different value;
- its parent renders, unless memoization allows React to skip it;
- a context value it reads changes;
- an external store subscription it reads publishes an update.

```jsx
function Parent() {
  const [theme, setTheme] = useState("light")

  return (
    <>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <UserProfile name="Asha" />
    </>
  )
}
```

When `theme` changes, `Parent` renders again and normally calls `UserProfile` again, even though its `name` prop is unchanged. `React.memo(UserProfile)` can skip that child render when its props are shallowly equal.

Important distinctions:

- Mutating a normal variable does not request a render.
- Updating a ref does not request a render.
- Calling a state setter with the same value may be skipped using `Object.is`.
- Changing a component's `key` does not merely re-render it; React replaces the old instance and resets its state.

Interview answer:

State updates, parent renders, context changes, and subscribed external-store updates can cause a component to render. A changed prop reaches a child through its parent's render; props do not independently schedule work.

### What Is A Stale Closure?

Every render creates a snapshot of props, state, and functions. A callback retains the snapshot from the render in which it was created. It becomes stale when it runs later but still reads old values.

```jsx
function DelayedCounter() {
  const [count, setCount] = useState(0)

  function incrementLater() {
    setTimeout(() => {
      setCount(count + 1)
    }, 1000)
  }

  return <button onClick={incrementLater}>Count: {count}</button>
}
```

If the button is used several times quickly, each timer may capture the same old `count`. Use a functional state update when the next value depends on the previous value:

```jsx
setTimeout(() => {
  setCount((currentCount) => currentCount + 1)
}, 1000)
```

A missing effect dependency is another common source:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000)
  return () => clearInterval(id)
}, []) // Captures the initial count.
```

Depending on `count` gives the interval the current value and lets React replace the old interval correctly:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000)
  return () => clearInterval(id)
}, [count])
```

Mental model: closures capture a render's snapshot; they do not automatically look up the latest state.

### When Can useMemo Hurt Performance?

`useMemo` has a cost: React must call the hook, compare dependencies, retain the cached value, and make the code harder to reason about. It can hurt when the calculation is cheap, dependencies change almost every render, or the memoized value is small and inexpensive to recreate.

```jsx
// The direct calculation is simpler and likely cheaper.
const fullName = `${firstName} ${lastName}`
```

This is unnecessary:

```jsx
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
)
```

A useful case is a measured expensive calculation with stable dependencies:

```jsx
const visibleRows = useMemo(
  () => sortAndFilterThousandsOfRows(rows, filters),
  [rows, filters]
)
```

Real-time scenario: memoizing every label and boolean in a dashboard adds bookkeeping without meaningful savings. Memoizing a costly transformation of thousands of rows may avoid noticeable work. Use the React Profiler or measurement instead of assuming memoization is faster.

Interview answer:

I use `useMemo` for a proven expensive calculation or when stable identity is required by another optimization. For cheap calculations, its dependency checking, retained memory, and complexity can cost more than recalculation.

### How Do You Prevent An API Race Condition?

Suppose a user searches for `react`, then quickly searches for `redux`. The `redux` request may finish first, followed by the older `react` request. Without protection, the old response overwrites the current results.

The preferred `fetch` solution is to cancel obsolete work with `AbortController`:

```jsx
function Search({ query }) {
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadResults() {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        )

        if (!response.ok) throw new Error("Request failed")

        const data = await response.json()
        setResults(data)
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError)
        }
      }
    }

    loadResults()

    return () => controller.abort()
  }, [query])

  return <ResultsList results={results} error={error} />
}
```

When `query` changes, cleanup aborts the previous request before the new effect starts. This avoids both wasted work and a stale state update.

If an API cannot be cancelled, ignore the obsolete result:

```jsx
useEffect(() => {
  let ignore = false

  async function loadUser() {
    const user = await fetchUser(userId)
    if (!ignore) setUser(user)
  }

  loadUser()

  return () => {
    ignore = true
  }
}, [userId])
```

For larger applications, a server-state library such as TanStack Query can manage cancellation, caching, deduplication, and stale responses consistently.

Interview answer:

I abort the previous request in effect cleanup and ignore `AbortError`. If cancellation is unavailable, I associate the response with the current effect using an ignore flag or request ID and update state only when it is still current.

### Rapid Interview Checklist

- Effects synchronize React with external systems after a commit.
- Cleanup runs before changed effects are set up again and on unmount.
- No dependency array means after every committed render.
- Strict Mode performs an extra development-only setup and cleanup cycle.
- Effect loops happen when an effect updates something that changes its dependencies.
- Objects and functions are compared by identity.
- Closures retain the state snapshot from their render.
- Memoization should solve measured work or identity problems.
- Cancel or ignore stale requests so older responses cannot win.

## useRef

`useRef` stores a mutable value that persists across renders without causing re-renders.

### DOM Access

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
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  )
}
```

### Previous Value

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
      <p>Current: {count}</p>
      <p>Previous: {previousCount.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

Interview answer:

Use `useRef` for DOM nodes, timer IDs, previous values, and mutable values that should not trigger re-renders.

## useReducer

`useReducer` manages state with a reducer function and dispatched actions.

Simple counter:

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

function CounterExample() {
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

Flow:

```text
User clicks button
   |
   v
dispatch(action)
   |
   v
reducer(state, action)
   |
   v
new state
   |
   v
component re-renders
```

Interview answer:

Use `useReducer` when state transitions are complex, related, or action-driven. Use `useState` for simple independent state.

## useContext

`useContext` reads a value from React Context without prop drilling.

```jsx
import { createContext, useContext } from "react"

const ThemeContext = createContext("light")

function Toolbar() {
  const theme = useContext(ThemeContext)

  return <p>Current theme: {theme}</p>
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  )
}
```

Interview answer:

Use Context for app-level values like theme, locale, auth summary, or feature flags. Avoid using one large context for frequently changing complex state.

## useId

`useId` creates a stable unique ID for accessibility attributes.

```jsx
import { useId } from "react"

function EmailField() {
  const emailId = useId()

  return (
    <div>
      <label htmlFor={emailId}>Email</label>
      <input id={emailId} />
    </div>
  )
}
```

Interview answer:

`useId` is useful when reusable components need unique IDs for labels, inputs, descriptions, or error messages. I do not use it for list keys.

## useMemo

`useMemo` memoizes a calculated value.

```jsx
import { useMemo, useState } from "react"

const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mouse", price: 20 },
]

function ProductTotal() {
  const [discount, setDiscount] = useState(0)

  const total = useMemo(() => {
    console.log("Calculating total")
    return products.reduce((sum, product) => sum + product.price, 0) - discount
  }, [discount])

  return (
    <div>
      <p>Total: {total}</p>
      <button onClick={() => setDiscount(discount + 10)}>Add Discount</button>
    </div>
  )
}
```

Interview answer:

Use `useMemo` for expensive calculations when recalculating on every render is wasteful. Do not use it everywhere.

### useMemo Vs Normal Function: When Console Comes

Important point:

React renders the component. During that render, JavaScript inside the component runs from top to bottom.

## Case 1: Normal Function Is Defined But Not Called

```jsx
function ProductTotal() {
  function calculateTotal() {
    console.log("Calculating total")
    return 100
  }

  return <p>Hello</p>
}
```

Console output:

```text
First render:
No output

Re-render:
No output
```

Why?

The function is only defined. It is not executed.

```text
calculateTotal function exists
  |
  v
but calculateTotal() is not called
  |
  v
console.log does not run
```

## Case 2: Normal Function Is Called During Render

```jsx
function ProductTotal() {
  function calculateTotal() {
    console.log("Calculating total")
    return 100
  }

  const total = calculateTotal()

  return <p>Total: {total}</p>
}
```

Console output:

```text
First render:
Calculating total

Every re-render:
Calculating total
```

Why?

This line calls the function during render:

```jsx
const total = calculateTotal()
```

So every time the component renders, the function runs again.

## Case 3: useMemo Is Used

```jsx
function ProductTotal() {
  const [discount, setDiscount] = useState(0)

  const total = useMemo(() => {
    console.log("Calculating total")
    return 100 - discount
  }, [discount])

  return (
    <div>
      <p>Total: {total}</p>
      <button onClick={() => setDiscount(discount + 10)}>
        Add Discount
      </button>
    </div>
  )
}
```

Console output:

```text
First render:
Calculating total

Re-render when discount changes:
Calculating total

Re-render when discount does not change:
No output
```

Why?

`useMemo` runs the callback on the first render because React needs to calculate and store the initial value.

After that, React checks the dependency array:

```jsx
[discount]
```

If `discount` changes, the callback runs again. If `discount` does not change, React reuses the previous cached value.

## Case 4: useMemo Exists But total Is Not Displayed

```jsx
function ProductTotal() {
  const [discount, setDiscount] = useState(0)

  const total = useMemo(() => {
    console.log("Calculating total")
    return 100 - discount
  }, [discount])

  return (
    <button onClick={() => setDiscount(discount + 10)}>
      Add Discount
    </button>
  )
}
```

Console output:

```text
First render:
Calculating total

Click Add Discount:
Calculating total
```

Why?

Even though this line is removed:

```jsx
<p>Total: {total}</p>
```

the hook is still executed:

```jsx
const total = useMemo(...)
```

So React still reaches `useMemo` during render and runs the callback when needed.

If you remove the entire `useMemo` line:

```jsx
// const total = useMemo(...)
```

then console output will not come.

Quick comparison:

```text
Normal function defined only
  -> console does not come

Normal function called during render
  -> console comes on every render

useMemo with []
  -> console comes only on first render

useMemo with [discount]
  -> console comes on first render and when discount changes

useMemo value not displayed in JSX
  -> console still comes because useMemo itself is still executed
```

Interview answer:

A normal function runs only when we call it. If we call it during render, it runs on every render. `useMemo` runs on the first render to create the cached value, then runs again only when its dependencies change. Displaying or not displaying the memoized value in JSX does not decide whether `useMemo` runs. The hook line itself decides that.

### What If Data Is Not Available On First Render?

`useMemo` still runs on the first render.

If the value needed inside `useMemo` is not available yet, the calculation can fail unless we handle it safely.

Problem example:

```jsx
function ProductTotal({ products }) {
  const total = useMemo(() => {
    return products.reduce((sum, product) => sum + product.price, 0)
  }, [products])

  return <p>Total: {total}</p>
}
```

If `products` is `undefined` on the first render, this line crashes:

```jsx
products.reduce(...)
```

Possible error:

```text
Cannot read properties of undefined
```

Why?

```text
First render
  |
  v
products is undefined
  |
  v
useMemo runs
  |
  v
products.reduce is called
  |
  v
crash
```

Safe option 1: default empty array.

```jsx
function ProductTotal({ products = [] }) {
  const total = useMemo(() => {
    return products.reduce((sum, product) => sum + product.price, 0)
  }, [products])

  return <p>Total: {total}</p>
}
```

Safe option 2: guard inside `useMemo`.

```jsx
function ProductTotal({ products }) {
  const total = useMemo(() => {
    if (!products) return 0

    return products.reduce((sum, product) => sum + product.price, 0)
  }, [products])

  return <p>Total: {total}</p>
}
```

Safe option 3: handle loading UI.

```jsx
function ProductTotal({ products, isLoading }) {
  const total = useMemo(() => {
    if (!products) return 0

    return products.reduce((sum, product) => sum + product.price, 0)
  }, [products])

  if (isLoading) return <p>Loading products...</p>

  return <p>Total: {total}</p>
}
```

Flow:

```text
First render
  |
  v
products undefined
  |
  v
useMemo runs
  |
  v
guard returns 0
  |
  v
UI shows loading or Total: 0

API response comes
  |
  v
products changes
  |
  v
useMemo runs again
  |
  v
real total calculated
```

Interview answer:

`useMemo` does not wait for data automatically. It runs during render. If required data is not available yet, we should use default values, guard conditions, optional chaining, or loading UI. Once the data arrives and the dependency changes, `useMemo` runs again and calculates the real value.

## useCallback

`useCallback` memoizes a function reference.

```jsx
import React, { useCallback, useState } from "react"

const SaveButton = React.memo(function SaveButton({ onSave }) {
  console.log("SaveButton rendered")
  return <button onClick={onSave}>Save</button>
})

function Parent() {
  const [text, setText] = useState("")
  const [count, setCount] = useState(0)

  const handleSave = useCallback(() => {
    console.log("Saved:", text)
  }, [text])

  return (
    <div>
      <input value={text} onChange={(event) => setText(event.target.value)} />
      <button onClick={() => setCount(count + 1)}>Re-render {count}</button>
      <SaveButton onSave={handleSave} />
    </div>
  )
}
```

Interview answer:

Use `useCallback` when function identity matters, especially when passing callbacks to memoized children or custom hooks.

### Detailed useCallback Explanation

In this example, `SaveButton` receives one prop: `onSave`.

```jsx
const SaveButton = React.memo(function SaveButton({ onSave }) {
  console.log("SaveButton rendered")
  return <button onClick={onSave}>Save</button>
})
```

Because `SaveButton` is wrapped with `React.memo`, React can skip re-rendering it when its props are the same as the previous render.

```jsx
const handleSave = useCallback(() => {
  console.log("Saved:", text)
}, [text])
```

`useCallback` remembers the `handleSave` function reference. It creates a new `handleSave` function only when `text` changes.

When only `count` changes:

```text
count changes
  |
  v
Parent re-renders
  |
  v
handleSave function reference stays the same
  |
  v
SaveButton does not re-render
```

When `text` changes:

```text
text changes
  |
  v
Parent re-renders
  |
  v
handleSave function reference changes
  |
  v
SaveButton re-renders
```

Important:

`useCallback` alone does not stop child re-renders. It only keeps the function reference stable.

If `SaveButton` is not wrapped with `React.memo`, then `SaveButton` will still re-render whenever `Parent` re-renders.

Useful pair:

```text
useCallback
  |
  +-- keeps function prop stable

React.memo
  |
  +-- skips child render if props are unchanged
```

Expected console output:

```text
Initial render:
SaveButton rendered

Click "Re-render 0":
No "SaveButton rendered"

Type "React" in input:
SaveButton rendered

Click "Save":
Saved: React
```

Interview answer:

`useCallback` does not mean the function runs only when dependencies change. It means the function is recreated only when dependencies change. The function still runs every time the user clicks the button.

## useTransition

`useTransition` marks a state update as non-urgent.

```jsx
import { useState, useTransition } from "react"

const items = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`)

function SearchExample() {
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleChange(event) {
    const value = event.target.value
    setInput(value)

    startTransition(() => {
      setSearchQuery(value)
    })
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
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

Important:

`setSearchQuery(value)` does not filter directly. It updates state. React re-renders, then `filteredItems` recalculates.

Interview answer:

Use `useTransition` when you control a state update and want to mark it as non-urgent, such as updating a large search result list while keeping typing responsive.

### useTransition Code Explanation

This example separates the urgent input update from the less urgent list filtering update.

```jsx
import { useState, useTransition } from "react"
```

Here we import:

- `useState` to store input and search values.
- `useTransition` to mark some updates as low priority.

```jsx
const items = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`)
```

This creates 10,000 items:

```text
Item 1
Item 2
Item 3
...
Item 10000
```

The list is intentionally large so filtering can be expensive.

```jsx
const [input, setInput] = useState("")
const [searchQuery, setSearchQuery] = useState("")
const [isPending, startTransition] = useTransition()
```

There are two states:

```text
input
  |
  +-- controls what the user types in the textbox
  +-- urgent update

searchQuery
  |
  +-- used for filtering the list
  +-- non-urgent update
```

`useTransition` gives two values:

```text
isPending
  |
  +-- true while the low-priority update is pending

startTransition
  |
  +-- marks a state update as non-urgent
```

Filtering:

```jsx
const filteredItems = items.filter((item) =>
  item.toLowerCase().includes(searchQuery.toLowerCase())
)
```

This filters the list based on `searchQuery`.

Important:

Filtering does not happen inside `setSearchQuery`. `setSearchQuery` only updates state. After that, React re-renders the component and `filteredItems` recalculates.

```text
searchQuery changes
  |
  v
component re-renders
  |
  v
filteredItems recalculates
```

Change handler:

```jsx
function handleChange(event) {
  const value = event.target.value
  setInput(value)

  startTransition(() => {
    setSearchQuery(value)
  })
}
```

Step by step:

```jsx
const value = event.target.value
```

Gets the latest typed value.

Example:

```text
User types "a"
value = "a"
```

```jsx
setInput(value)
```

This updates the input immediately. This is urgent because typing should feel fast.

```jsx
startTransition(() => {
  setSearchQuery(value)
})
```

This tells React:

```text
Updating searchQuery and filtering the big list is less urgent.
Keep the input responsive first.
```

Input:

```jsx
<input value={input} onChange={handleChange} />
```

The input value comes from `input`, not `searchQuery`. That is why typing stays responsive.

Pending message:

```jsx
{isPending && <p>Updating results...</p>}
```

If React is still processing the non-urgent update, it shows:

```text
Updating results...
```

Rendering results:

```jsx
{filteredItems.slice(0, 10).map((item) => (
  <li key={item}>{item}</li>
))}
```

This displays only the first 10 matching results.

`slice(0, 10)` is used so the UI does not render all 10,000 matching items.

Initial output:

```text
Item 1
Item 2
Item 3
...
Item 10
```

If the user types `99`, output may look like:

```text
Item 99
Item 199
Item 299
Item 399
...
```

Interview explanation:

`useTransition` is useful when one update is urgent and another update is expensive. In this example, updating the input text is urgent, but filtering and rendering a large list is less urgent. So we update `input` normally and update `searchQuery` inside `startTransition`.

Short answer:

```text
setInput(value)
  -> urgent, keeps typing fast

startTransition(() => setSearchQuery(value))
  -> non-urgent, updates filtered results in the background
```

## useDeferredValue

`useDeferredValue` gives a deferred version of a value.

```jsx
import { useDeferredValue, useState } from "react"

const items = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`)

function DeferredSearchExample() {
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

Interview answer:

Use `useDeferredValue` when a value has already changed but expensive UI can lag behind slightly.

## useTransition Vs useDeferredValue

```text
useTransition
= defer a state update

useDeferredValue
= defer a value that already changed
```

Interview answer:

If I control the state update, I use `useTransition`. If I already have a value or receive it as props and want expensive UI to lag behind, I use `useDeferredValue`.

### How To Demonstrate useTransition Vs useDeferredValue In Interviews

Use this example explanation:

```text
I have a search input and 10,000 records.
Typing should be fast.
Filtering 10,000 records can be expensive.
```

`useTransition` is useful when we control the state update.

```jsx
function handleChange(event) {
  const value = event.target.value

  setInput(value)

  startTransition(() => {
    setSearchQuery(value)
  })
}
```

Explanation:

```text
setInput(value)
  |
  +-- urgent update
  +-- keeps typing fast

startTransition(() => setSearchQuery(value))
  |
  +-- non-urgent update
  +-- updates expensive filtered results
```

Interview line:

I use `useTransition` when I control the state update and want to mark that update as low priority.

`useDeferredValue` is useful when the value has already changed.

```jsx
const [search, setSearch] = useState("")
const deferredSearch = useDeferredValue(search)
```

Explanation:

```text
search
  |
  +-- latest typed value
  +-- updates immediately

deferredSearch
  |
  +-- deferred version
  +-- can lag slightly behind search
  +-- used for expensive rendering
```

Interview line:

I use `useDeferredValue` when I already have a value, or receive it as props, and I want expensive UI based on that value to lag behind slightly.

Best interview answer:

`useTransition` and `useDeferredValue` both help keep urgent UI responsive. The difference is where we apply them. `useTransition` wraps a state update that we control. `useDeferredValue` creates a delayed version of a value that has already changed.

## Custom Hooks

A custom hook is a reusable function that starts with `use` and can call other hooks.

```jsx
import { useState } from "react"

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  function toggle() {
    setValue((previousValue) => !previousValue)
  }

  return { value, toggle }
}

function ToggleExample() {
  const { value, toggle } = useToggle(false)

  return (
    <div>
      <p>Status: {value ? "ON" : "OFF"}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}
```

Interview answer:

Custom hooks extract reusable stateful logic from components. They improve reuse, readability, and testability.

## Quick Interview Summary

- `useState`: simple local state.
- `useEffect`: external synchronization.
- `useRef`: mutable value without re-render.
- `useReducer`: complex state transitions.
- `useContext`: consume shared context.
- `useMemo`: memoize calculated value.
- `useCallback`: memoize function reference.
- `useTransition`: defer non-urgent state update.
- `useDeferredValue`: defer a value for expensive rendering.
- custom hooks: reuse stateful logic.
