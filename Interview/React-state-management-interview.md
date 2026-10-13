# React State Management Interview Notes

Purpose: quick interview revision with simple JavaScript examples.

## What Is State Management?

State management means deciding where data should live and how it should update.

In React, not all state belongs in one place.

```text
Local UI state
  |
  +-- useState / useReducer

Shared client state
  |
  +-- Context API / Redux

Server state
  |
  +-- TanStack Query / RTK Query / Apollo / SWR
```

Interview answer:

I first classify the state. Local UI state stays close to the component. Shared client state can use Context or Redux. Backend data should be treated as server state and managed with caching/invalidation tools.

## Local State

Use local state when only one component needs the value.

```jsx
import { useState } from "react"

function TogglePanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <p>Panel content</p>}
    </div>
  )
}
```

Use cases:

- input value
- modal open/close
- selected tab
- local loading state
- dropdown state

## Lifting State Up

Lift state up when sibling components need to share the same value.

```jsx
function Parent() {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <>
      <UserList onSelectUser={setSelectedUser} />
      <UserDetails user={selectedUser} />
    </>
  )
}
```

Interview answer:

When two sibling components need the same state, I move that state to their nearest common parent and pass data/callbacks through props.

## State Colocation

State colocation means keeping state as close as possible to where it is used.

Bad:

```jsx
function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return <Header isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} />
}
```

Better:

```jsx
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && <ul><li>Profile</li></ul>}
    </div>
  )
}
```

Interview answer:

Colocating state reduces unnecessary re-renders and keeps components easier to understand.

## Essential Vs Derived State

Essential state is the source of truth.

Derived state can be calculated from existing state.

```jsx
const cartItems = [
  { id: 1, price: 100, quantity: 2 },
  { id: 2, price: 50, quantity: 1 },
]

const total = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
)
```

Do not store `total` separately unless necessary.

Interview answer:

I avoid storing derived state because it can become out of sync. I calculate it during render or memoize it if expensive.

## Context API

Context helps share values without prop drilling.

```jsx
import { createContext, useContext } from "react"

const ThemeContext = createContext("light")

function ThemeLabel() {
  const theme = useContext(ThemeContext)
  return <p>Theme: {theme}</p>
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemeLabel />
    </ThemeContext.Provider>
  )
}
```

Simple counter example using Context API:

```jsx
import { createContext, useContext, useState } from "react"

const CounterContext = createContext(null)

function CounterProvider({ children }) {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
  }

  function decrement() {
    setCount(count - 1)
  }

  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  )
}

function CounterDisplay() {
  const { count } = useContext(CounterContext)

  return <h2>Count: {count}</h2>
}

function CounterButtons() {
  const { increment, decrement } = useContext(CounterContext)

  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}

function App() {
  return (
    <CounterProvider>
      <CounterDisplay />
      <CounterButtons />
    </CounterProvider>
  )
}
```

Explanation:

- `CounterContext` creates a shared place for counter data.
- `CounterProvider` stores the actual `count` state using `useState`.
- The provider shares `count`, `increment`, and `decrement`.
- `CounterDisplay` reads and displays the count.
- `CounterButtons` reads the update functions and changes the count.

Why double curly braces in provider value?

```jsx
<CounterContext.Provider value={{ count, increment, decrement }}>
```

The outer curly braces mean we are writing JavaScript inside JSX:

```jsx
value={...}
```

The inner curly braces create a JavaScript object:

```jsx
{ count, increment, decrement }
```

So this:

```jsx
value={{ count, increment, decrement }}
```

means:

```jsx
value={
  {
    count: count,
    increment: increment,
    decrement: decrement,
  }
}
```

We pass an object because the context needs to share multiple values.

Quick examples:

```jsx
value={count}
```

This passes only one value.

```jsx
value={{ count }}
```

This passes one object with `count` inside it.

```jsx
value={{ count, increment, decrement }}
```

This passes one object with state and update functions inside it.

Interview answer:

In this example, Context API helps avoid prop drilling. The counter state lives inside `CounterProvider`, and child components access it using `useContext`. This is useful when multiple components need the same state or update functions.

Good use cases:

- theme
- locale
- auth summary
- feature flags
- static app config

## Context API Disadvantages

Problems:

- provider value changes can re-render many consumers
- large context objects become hard to maintain
- not ideal for frequently changing complex state
- no built-in middleware or DevTools like Redux

Bad pattern:

```jsx
<AppContext.Provider value={{ user, theme, filters, notifications }}>
  <App />
</AppContext.Provider>
```

Better:

```text
AuthContext
ThemeContext
FiltersContext
```

Interview answer:

Context is good for simple app-wide values, but I avoid using one huge context for all state. For complex shared state, Redux may be better.

## Redux

Redux is a predictable state management library.

Flow:

```text
Component
  |
  | dispatch(action)
  v
Reducer
  |
  v
Redux store updates
  |
  v
Component reads state
```

Interview answer:

Redux centralizes important shared client state. Components dispatch actions, reducers update state predictably, and selectors read state.

## Redux Toolkit

Redux Toolkit is the recommended way to write Redux.

```jsx
import { createSlice } from "@reduxjs/toolkit"

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment(state) {
      state.value += 1
    },
    decrement(state) {
      state.value -= 1
    },
  },
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
```

What is `state` here?

```jsx
increment(state) {
  state.value += 1
}
```

Here `state` means the current state of this Redux slice.

In this slice, the initial state is:

```jsx
initialState: {
  value: 0,
}
```

So at the beginning, the counter slice state is:

```js
{
  value: 0
}
```

When the component calls:

```jsx
dispatch(increment())
```

Redux Toolkit automatically calls the `increment` reducer and passes the latest slice state into it.

Flow:

```text
Initial slice state:
{ value: 0 }

User clicks Increment

dispatch(increment())

Redux Toolkit calls:
increment(state)

Here state is:
{ value: 0 }

Reducer updates:
state.value += 1

New slice state:
{ value: 1 }
```

So this:

```jsx
increment(state) {
  state.value += 1
}
```

means:

```text
Take the current counter slice state,
increase value by 1,
and save the updated state in Redux.
```

Important difference:

```jsx
increment(state) {
  state.value += 1
}
```

Here `state` means only the current slice state:

```js
{
  value: 0
}
```

But inside `useSelector`:

```jsx
const count = useSelector((state) => state.counter.value)
```

Here `state` means the full Redux store state:

```js
{
  counter: {
    value: 0
  }
}
```

Interview answer:

In a Redux Toolkit reducer, `state` is the current state of that slice. We define the starting value using `initialState`, and Redux automatically passes the latest state into each reducer when an action is dispatched. In `useSelector`, `state` represents the full Redux store state.

Interview answer:

Redux Toolkit reduces boilerplate, generates actions, configures good defaults, and uses Immer internally for immutable updates.

## Redux Toolkit Step-By-Step Setup

Use this flow in interviews when the interviewer asks, "How do you create a Redux store and use it in a component?"

```text
1. Create slice
   |
   v
2. Export actions and reducer
   |
   v
3. Create store with configureStore
   |
   v
4. Wrap app with Provider
   |
   v
5. Read state with useSelector
   |
   v
6. Update state with dispatch(action())
```

### Step 1: Create A Slice

File: `src/features/counter/counterSlice.js`

```jsx
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  value: 0,
}

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1
    },
    decrement(state) {
      state.value -= 1
    },
    reset(state) {
      state.value = 0
    },
    incrementByAmount(state, action) {
      state.value += action.payload
    },
  },
})

export const {
  increment,
  decrement,
  reset,
  incrementByAmount,
} = counterSlice.actions

export default counterSlice.reducer
```

Explanation:

- `createSlice` creates action creators and the reducer.
- `state.value += 1` looks like mutation, but Redux Toolkit uses Immer internally.
- `action.payload` carries data from the component to the reducer.

### Step 2: Create The Store

File: `src/store/store.js`

```jsx
import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})
```

Explanation:

- `configureStore` creates the Redux store.
- The key `counter` decides where this slice lives in state.
- The state shape becomes:

```js
{
  counter: {
    value: 0
  }
}
```

### Declaring Multiple Slices In Store

When the app has multiple slices, import each slice reducer and add it inside the `reducer` object.

Example:

```jsx
import { configureStore } from "@reduxjs/toolkit"

import counterReducer from "../features/counter/counterSlice"
import userReducer from "../features/user/userSlice"
import cartReducer from "../features/cart/cartSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    cart: cartReducer,
  },
})
```

Now the full Redux store state looks like this:

```js
{
  counter: {
    value: 0
  },
  user: {
    name: "Karteek",
    isLoggedIn: true
  },
  cart: {
    items: []
  }
}
```

Each key inside the `reducer` object becomes a property in the Redux state.

```jsx
reducer: {
  counter: counterReducer,
  user: userReducer,
  cart: cartReducer,
}
```

So:

```text
counter -> state.counter
user    -> state.user
cart    -> state.cart
```

Reading values in components:

```jsx
const count = useSelector((state) => state.counter.value)

const userName = useSelector((state) => state.user.name)

const cartItems = useSelector((state) => state.cart.items)
```

Interview answer:

To declare multiple slices, I import each slice reducer and register them inside the `reducer` object of `configureStore`. Each key becomes a property in the Redux store state, and components can access that data using `useSelector`.

### Step 3: Wrap The App With Provider

File: `src/main.jsx`

```jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./store/store"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```

Explanation:

`Provider` makes the Redux store available to all React components below it.

### Step 4: Use Redux State In A Component

File: `src/features/counter/Counter.jsx`

```jsx
import { useDispatch, useSelector } from "react-redux"
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from "./counterSlice"

export default function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Count: {count}</h2>

      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Add 5
      </button>
    </div>
  )
}
```

Explanation:

- `useSelector` reads data from Redux state.
- `useDispatch` sends an action to Redux.
- `dispatch(increment())` calls the reducer logic.
- `dispatch(incrementByAmount(5))` sends `5` as `action.payload`.

### Step 5: Show Component In App

File: `src/App.jsx`

```jsx
import Counter from "./features/counter/Counter"

export default function App() {
  return <Counter />
}
```

Interview answer:

I create a slice using `createSlice`, add the slice reducer to `configureStore`, wrap the app with `Provider`, read state using `useSelector`, and update state by dispatching actions from the component.

## Redux Toolkit Data Flow Example

```text
User clicks "Add 5"
        |
        v
dispatch(incrementByAmount(5))
        |
        v
counterSlice reducer receives action
        |
        v
state.counter.value updates
        |
        v
Counter component re-renders with new value
```

This is the clean interview explanation:

Redux does not update state directly from the component. The component dispatches an action. The reducer receives that action and returns the next state. React re-renders the subscribed components.

## Immer

Immer lets us write mutable-looking code while producing immutable updates.

```jsx
increment(state) {
  state.value += 1
}
```

This looks like mutation, but Redux Toolkit uses Immer to create the next immutable state safely.

Without Immer:

```jsx
return {
  ...state,
  value: state.value + 1,
}
```

Interview answer:

Immer makes reducers easier to read while still preserving immutability.

## Redux Store And Provider

```jsx
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import counterReducer from "./counterSlice"

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

function AppRoot() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
```

This is the short version. For interviews, prefer explaining the full step-by-step flow above.

Component usage:

```jsx
import { useDispatch, useSelector } from "react-redux"
import { increment } from "./counterSlice"

function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  )
}
```

## Redux Middleware

Middleware runs between dispatch and reducer.

```text
dispatch(action)
  |
  v
middleware
  |
  v
reducer
```

Use cases:

- async logic
- logging
- analytics
- API calls
- custom validation

## Redux Thunk

Thunk lets action creators return functions.

```jsx
function loadUser(userId) {
  return async (dispatch) => {
    dispatch({ type: "user/loading" })

    try {
      const response = await fetch(`/api/users/${userId}`)
      const user = await response.json()
      dispatch({ type: "user/loaded", payload: user })
    } catch {
      dispatch({ type: "user/failed" })
    }
  }
}
```

Interview answer:

Thunk is useful for straightforward async Redux flows. For API caching, RTK Query is usually better.

### Redux Toolkit `createAsyncThunk` Example

In modern Redux Toolkit, we commonly use `createAsyncThunk` for async API calls.

```jsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("/api/users")

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
})

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})
```

`createAsyncThunk` automatically creates three action states:

```text
fetchUsers.pending
fetchUsers.fulfilled
fetchUsers.rejected
```

Flow:

```text
Component dispatches fetchUsers()
        |
        v
fetchUsers.pending
        |
        v
loading = true
error = null
        |
        v
API call starts
        |
        +-- Success
        |      |
        |      v
        |   fetchUsers.fulfilled
        |      |
        |      v
        |   loading = false
        |   data = action.payload
        |
        +-- Failure
               |
               v
            fetchUsers.rejected
               |
               v
            loading = false
            error = action.error.message
```

### What Is `builder`?

`builder` is an object provided by Redux Toolkit inside `extraReducers`.

```jsx
extraReducers: (builder) => {
  // builder is available here
}
```

It helps us define how this slice should respond to actions.

Think of `builder` like a helper object:

```text
builder
   |
   +-- addCase()
   +-- addMatcher()
   +-- addDefaultCase()
```

Most commonly, we use:

```jsx
builder.addCase()
```

Simple meaning:

```jsx
extraReducers: (builder) => {
  builder
    .addCase(fetchUsers.pending, ...)
    .addCase(fetchUsers.fulfilled, ...)
    .addCase(fetchUsers.rejected, ...)
}
```

This means:

> Builder, please add reducer logic for these action cases.

### What Is `builder.addCase()`?

`builder.addCase()` tells Redux Toolkit:

> When this action happens, run this reducer function.

Syntax:

```jsx
builder.addCase(actionType, reducerFunction)
```

Example:

```jsx
builder.addCase(fetchUsers.pending, (state) => {
  state.loading = true
})
```

Meaning:

```text
When fetchUsers.pending action is dispatched,
run this function:
state.loading = true
```

Why do we use it?

Because `createAsyncThunk` automatically creates three actions:

```text
fetchUsers.pending
fetchUsers.fulfilled
fetchUsers.rejected
```

So we write reducers for each one:

```jsx
extraReducers: (builder) => {
  builder
    .addCase(fetchUsers.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
}
```

`builder.addCase()` is similar to event handling:

```jsx
button.addEventListener("click", function () {
  console.log("button clicked")
})
```

Similar idea:

```jsx
builder.addCase(fetchUsers.fulfilled, function () {
  console.log("API success")
})
```

It means:

> When this action occurs, execute this logic.

Interview answer:

> `builder` is an object provided by Redux Toolkit inside `extraReducers`. It is used to define how a slice responds to actions, especially actions created outside the slice like async thunk actions. `builder.addCase()` registers reducer logic for a specific action. For example, when `fetchUsers.fulfilled` is dispatched, `addCase` runs the reducer that stores the API response in Redux state.

## JavaScript Generators

A generator is a special JavaScript function that can pause its execution and continue later from the same position.

Generator functions use `function*`, and `yield` pauses execution:

```js
function* numberGenerator() {
  yield 10
  yield 20
  return 30
}

const iterator = numberGenerator()

console.log(iterator.next()) // { value: 10, done: false }
console.log(iterator.next()) // { value: 20, done: false }
console.log(iterator.next()) // { value: 30, done: true }
console.log(iterator.next()) // { value: undefined, done: true }
```

Calling `numberGenerator()` does not execute its body immediately. It returns a generator object that follows both the iterator and iterable protocols.

### Generator Mental Model

```text
Call generator function
  |
  v
Receive generator object
  |
  v
next() starts execution
  |
  v
yield pauses and returns a value
  |
  v
next() resumes after that yield
  |
  v
return/end finishes with done: true
```

Unlike a normal function, a generator preserves its local variables and execution position while paused.

```js
function* counter() {
  let count = 0

  while (count < 3) {
    yield count
    count += 1
  }
}

const counts = counter()

counts.next() // { value: 0, done: false }
counts.next() // { value: 1, done: false }
counts.next() // { value: 2, done: false }
counts.next() // { value: undefined, done: true }
```

### yield Vs return

```text
yield
  -> produces a value
  -> pauses the generator
  -> allows later continuation

return
  -> produces the final value
  -> finishes the generator
  -> sets done to true
```

### Sending A Value Into A Generator

`next(value)` resumes the generator and makes `value` the result of the currently paused `yield` expression:

```js
function* conversation() {
  const name = yield "What is your name?"
  const role = yield `Hello ${name}. What is your role?`
  return `${name} works as ${role}`
}

const chat = conversation()

chat.next()
// { value: "What is your name?", done: false }

chat.next("Karteek")
// { value: "Hello Karteek. What is your role?", done: false }

chat.next("Frontend Developer")
// { value: "Karteek works as Frontend Developer", done: true }
```

The first `next()` argument is ignored because the generator is not yet paused at a `yield` expression.

### Lazy Evaluation

Generators calculate values only when requested. This is useful for large or potentially infinite sequences:

```js
function* createIds() {
  let id = 1

  while (true) {
    yield id
    id += 1
  }
}

const ids = createIds()

ids.next().value // 1
ids.next().value // 2
ids.next().value // 3
```

The infinite loop does not freeze the application because each `yield` pauses execution.

### Iterating With for...of

Because a generator is iterable, it can be consumed with `for...of`:

```js
function* onboardingSteps() {
  yield "Account Type"
  yield "Proof of Identity"
  yield "Proof of Address"
  yield "Review"
}

for (const step of onboardingSteps()) {
  console.log(step)
}
```

`for...of` consumes yielded values but does not include the final value produced by `return`.

### Delegating With yield*

`yield*` delegates to another iterable or generator:

```js
function* documentSteps() {
  yield "Proof of Identity"
  yield "Proof of Address"
}

function* completeOnboarding() {
  yield "Account Type"
  yield* documentSteps()
  yield "Review"
}

console.log([...completeOnboarding()])
// ["Account Type", "Proof of Identity", "Proof of Address", "Review"]
```

### Generator Cleanup And Cancellation

A generator exposes `return()` and `throw()` in addition to `next()`. A `finally` block can perform cleanup if iteration ends early:

```js
function* workflow() {
  try {
    yield "started"
    yield "processing"
  } finally {
    console.log("workflow cleanup")
  }
}

const process = workflow()

process.next()
process.return("cancelled")
// Logs: workflow cleanup
// Returns: { value: "cancelled", done: true }
```

This controllable execution model is one reason generators are useful for workflow orchestration.

### Async Generators

An async generator combines `async`, `function*`, `await`, and `yield`. It is useful when values arrive asynchronously over time:

```js
async function* fetchPages() {
  let page = 1

  while (page <= 3) {
    const response = await fetch(`/api/clients?page=${page}`)
    yield await response.json()
    page += 1
  }
}

for await (const clients of fetchPages()) {
  console.log(clients)
}
```

Promises represent one eventual result. Async generators can represent a sequence of asynchronous results.

### Why Redux Saga Uses Generators

Redux Saga uses generators to describe an async workflow as a sequence of plain effect descriptions. The Saga middleware executes those effects and resumes the generator with their results.

```js
import { call, put, takeLatest } from "redux-saga/effects"

function* fetchClient(action) {
  try {
    const client = yield call(api.fetchClient, action.payload)
    yield put({ type: "client/fetchSucceeded", payload: client })
  } catch (error) {
    yield put({ type: "client/fetchFailed", payload: error.message })
  }
}

function* watchClientRequests() {
  yield takeLatest("client/fetchRequested", fetchClient)
}
```

Mental model:

```text
Saga generator yields call(...)
        |
Saga middleware performs API call
        |
Middleware resumes generator with result
        |
Generator yields put(...)
        |
Middleware dispatches Redux action
```

`yield call(...)` does not itself execute the API request. It yields an effect object describing the operation. Redux Saga middleware interprets it. This makes the workflow declarative and easier to test.

```js
const generator = fetchClient({ payload: "C101" })

expect(generator.next().value).toEqual(
  call(api.fetchClient, "C101")
)

const client = { id: "C101", name: "Example Client" }

expect(generator.next(client).value).toEqual(
  put({ type: "client/fetchSucceeded", payload: client })
)
```

`takeLatest` is useful for search or selection workflows because a newer matching action cancels the previous Saga task. For operations such as payments where every action must complete, `takeEvery` or a more explicit strategy may be appropriate.

### Generators Vs async/await

```text
async/await
  -> simpler for ordinary API calls
  -> runtime returns a Promise
  -> familiar imperative flow

generators
  -> execution controlled externally
  -> can pause, resume, receive values, throw, and return
  -> useful for lazy sequences and orchestration libraries
```

For most React API requests, use `async/await` with TanStack Query, RTK Query, or a thunk. Generators are most valuable when a library such as Redux Saga uses their controllable execution model for cancellation, retries, races, and multi-step workflows.

### Generator Interview Q&A

#### What Is A Generator?

A generator is a function declared with `function*` that can pause at `yield` and resume later while preserving its execution state.

#### Does Calling A Generator Function Execute It?

No. Calling it returns a generator object. Execution starts when `next()` is called.

#### What Does next() Return?

It returns `{ value, done }`. `value` is the yielded or returned value, and `done` indicates whether the generator has finished.

#### What Is The Difference Between yield And return?

`yield` pauses and can be resumed. `return` completes the generator and produces a result with `done: true`.

#### Why Are Generators Memory Efficient?

They can produce values lazily instead of creating an entire collection in memory. Only requested values need to be calculated.

#### Why Does Redux Saga Use Generators?

Generators let middleware pause a workflow, inspect yielded effect descriptions, execute asynchronous work, inject results or errors, and support cancellation and race handling.

#### Should Generators Replace async/await?

No. `async/await` is simpler for most application code. Generators are appropriate for lazy iteration or libraries that need external control over execution.

Interview answer:

> A generator is a resumable JavaScript function declared with `function*`. Calling it returns an iterator, and each `next()` call runs until the next `yield`. Generators preserve local state while paused and support values being passed back in through `next()`. Redux Saga uses this behavior so middleware can control, test, cancel, and coordinate asynchronous workflows. For normal API calls I usually prefer `async/await` or a server-state library.

## Redux Thunk Vs Redux Saga

```text
Redux Thunk
  |
  +-- simpler
  +-- function-based async logic
  +-- good for common API calls

Redux Saga
  |
  +-- generator-based
  +-- better for complex workflows
  +-- useful for orchestration/cancellation
```

Interview answer:

Thunk is simpler for most async needs. Saga may be used for complex flows, but many modern apps use RTK Query for server state.

## Context API Vs Redux

```text
Context API
  |
  +-- simple global values
  +-- theme, locale, auth summary

Redux
  |
  +-- complex shared state
  +-- predictable updates
  +-- DevTools
  +-- middleware
```

Interview answer:

I use Context for simple global values and Redux for complex shared state with many actions, frequent updates, or debugging needs.

### Context API Vs Redux: Interview Deep Dive

Context and Redux overlap in making data available across a tree, but they solve different core problems.

```text
Context
  -> dependency injection through the component tree
  -> React controls provider and consumer updates

Redux
  -> external state container with explicit actions and reducers
  -> selectors subscribe components to selected state
```

Context is built into React and works well for relatively stable cross-cutting values:

```jsx
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
```

Common examples are theme, locale, feature flags, and an authenticated-user summary.

Redux Toolkit is useful when shared client state has many update paths, needs predictable transitions, or benefits from selectors, middleware, and time-travel-style DevTools:

```jsx
dispatch(cartItemAdded(product))
const total = useSelector(selectCartTotal)
```

Real-time scenario: a checkout application has cart rules, promotions, inventory events, and updates from many screens. Redux provides named events, centralized transition logic, selector-based subscriptions, and debugging history. A theme value would not justify that machinery.

Context can be the wrong tool when:

- one large provider contains many unrelated values;
- its value changes frequently and many consumers re-render;
- complex updates are scattered across components;
- the team needs middleware, action history, or strong debugging conventions;
- consumers need fine-grained subscriptions to different slices.

Context does not replace state management by itself; the state still lives in `useState` or `useReducer` inside the provider. It mainly transports that value. Splitting contexts and memoizing provider values can help, but they do not provide Redux-style selector subscriptions by default.

Redux can also be the wrong tool. Local input state, a single modal, theme, or a small app may not need a global store. Backend cache data may fit TanStack Query, RTK Query, Apollo, or SWR better than either plain Context or hand-written Redux state.

Decision model:

```text
Only one subtree needs it?       -> local state / lift state
Stable cross-cutting value?      -> Context
Complex shared client workflow?  -> Redux Toolkit
Remote cached data?              -> server-state library
```

Interview answer:

Context distributes a value through a React tree; Redux is an external state-management system with actions, reducers, selectors, middleware, and DevTools. I use Context for stable cross-cutting values and Redux Toolkit for complex, frequently updated shared client state. Context is a poor fit when broad provider updates or complicated state transitions become difficult to optimize and debug.

## Client State Vs Server State

Client state is owned by the frontend.

Examples:

- selected tab
- modal open
- theme
- local form state
- global filters

Server state is owned by the backend.

Examples:

- user profile
- transactions
- onboarding status
- document verification result
- dashboard widgets

Interview answer:

I do not store all backend data manually in Redux. Backend data should usually be managed as server state with caching and invalidation.

## TanStack Query

TanStack Query manages server state.

```jsx
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"

const queryClient = new QueryClient()

function ProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong</p>

  return data.map((product) => <p key={product.id}>{product.name}</p>)
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>
  )
}
```

Interview answer:

TanStack Query is great for API caching, loading/error states, stale time, refetching, and invalidation without requiring Redux.

## RTK Query

RTK Query is part of Redux Toolkit and manages server state inside Redux.

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
```

Interview answer:

If the app already uses Redux Toolkit, RTK Query is a natural choice for server-state caching.

## RTK Query Step-By-Step Setup

Use this when the interviewer asks, "How do you call APIs using Redux Toolkit?"

```text
1. Create API slice
   |
   v
2. Add API reducer and middleware to store
   |
   v
3. Wrap app with Redux Provider
   |
   v
4. Use generated query/mutation hooks in components
```

### Step 1: Create API Slice

File: `src/services/productsApi.js`

```jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useAddProductMutation,
} = productsApi
```

Explanation:

- `builder.query` is used for GET/read operations.
- `builder.mutation` is used for POST/PUT/PATCH/DELETE operations.
- `providesTags` and `invalidatesTags` help RTK Query refetch stale data after mutations.

### Step 2: Add API Slice To Store

File: `src/store/store.js`

```jsx
import { configureStore } from "@reduxjs/toolkit"
import { productsApi } from "../services/productsApi"

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
})
```

Explanation:

- The API reducer stores cache data.
- The API middleware handles caching, invalidation, polling, and request lifecycle behavior.

Is Redux middleware needed for RTK Query?

Yes. RTK Query needs its API middleware to be added to the Redux store.

```jsx
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(productsApi.middleware),
```

The reducer stores RTK Query cache data:

```jsx
[productsApi.reducerPath]: productsApi.reducer
```

The middleware controls RTK Query behavior:

```jsx
productsApi.middleware
```

RTK Query middleware handles:

- API request lifecycle
- caching
- automatic refetching
- invalidation
- polling
- request deduplication

Interview answer:

Yes, RTK Query requires its API middleware to be added to the Redux store. The API reducer stores cached data, while the middleware handles requests, caching behavior, invalidation, polling, and automatic refetching.

### Step 3: Use Generated Hooks In Component

```jsx
import {
  useAddProductMutation,
  useGetProductsQuery,
} from "../services/productsApi"

export default function ProductsPage() {
  const { data = [], isLoading, error } = useGetProductsQuery()
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation()

  async function handleAddProduct() {
    await addProduct({ title: "New Product" })
  }

  if (isLoading) return <p>Loading products...</p>
  if (error) return <p role="alert">Failed to load products</p>

  return (
    <div>
      <button disabled={isAdding} onClick={handleAddProduct}>
        Add Product
      </button>

      {data.map((product) => (
        <p key={product.id}>{product.title}</p>
      ))}
    </div>
  )
}
```

Interview answer:

RTK Query generates hooks from API endpoints. The component does not manually dispatch loading, success, and error actions. RTK Query handles caching and request status, and mutations can invalidate query data automatically.

## TanStack Query Vs RTK Query

```text
TanStack Query
  |
  +-- standalone
  +-- no Redux required
  +-- great default for many React apps

RTK Query
  |
  +-- part of Redux Toolkit
  +-- best when Redux already exists
  +-- API slices and generated hooks
```

Interview answer:

I would not add Redux only for API caching. For a new app without Redux, TanStack Query is often simpler. If Redux Toolkit already exists, RTK Query fits well.

## Apollo And SWR In State Management

Apollo is best for GraphQL-heavy apps.

SWR is lightweight and follows stale-while-revalidate caching.

```text
GraphQL-heavy app -> Apollo
Simple lightweight fetching -> SWR
General REST/server state -> TanStack Query
Redux app -> RTK Query
```

## Authentication, Backend Data, And Global Settings

State decision:

```text
Authentication summary
  |
  +-- Context or Redux depending on complexity

Backend data
  |
  +-- TanStack Query / RTK Query / Apollo / SWR

Global settings
  |
  +-- Context or Redux
```

Interview answer:

For authentication, I keep session/user summary available globally. For backend data, I use server-state caching. For global UI settings like theme or locale, Context is usually enough.

## Resume-Based Examples

Stablehouse:

- Context or Redux can store auth summary and onboarding UI state.
- TanStack Query/Apollo can cache onboarding status.
- Uploading POI/POA should invalidate onboarding status.
- Server state should not be manually guessed after document upload.

HNB Digital Lobby:

- Redux can manage shared dashboard filters and selected account/branch.
- RTK Query can manage REST API data if Redux Toolkit is already used.
- Context can handle theme or simple app-level values.

## Quick Interview Summary

- Keep local state local.
- Lift state only when siblings need it.
- Colocate state to reduce unnecessary re-renders.
- Use Context for simple global values.
- Use Redux for complex shared client state.
- Use TanStack Query, RTK Query, Apollo, or SWR for server state.
- Avoid storing derived values unless necessary.
- Do not put every value into Redux.
