# Redux And RTK Query

## Why Redux Exists

Redux is a predictable state management library. It helps manage application state when many components need to read or update the same data.

In small React apps, `useState`, `useReducer`, props, and Context may be enough. Redux becomes useful when the app has:

- many screens sharing the same data
- complex state transitions
- authentication/session state
- dashboard filters shared across components
- predictable debugging needs
- large teams working on the same codebase

Interview answer:

Redux centralizes important application state in a store. Components dispatch actions to describe what happened, reducers update state predictably, and components subscribe to the state they need.

## Simple Counter Example In This Folder

This folder now has a small Redux counter example.

Files:

```text
src/store/store.ts
src/store/hooks.ts
src/interview-topics/redux/counterSlice.ts
src/interview-topics/redux/ReduxExample.tsx
```

The purpose is to understand the basic Redux flow before adding more advanced examples.

```text
Click Increment button
      |
      v
dispatch(increment())
      |
      v
counterSlice reducer runs
      |
      v
Redux store updates counter.value
      |
      v
ReduxExample re-renders with new count
```

### Store

The store combines Redux reducers and gives React one central Redux state container.

```ts
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})
```

State shape:

```text
RootState
  |
  +-- counter
        |
        +-- value
        +-- step
```

### Provider

The Redux `<Provider>` wraps the app so all components can access the store.

```tsx
<Provider store={store}>
  <App />
</Provider>
```

Without the provider, `useSelector` and `useDispatch` cannot access the Redux store.

### Slice

The counter slice owns the counter state and reducers.

```ts
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    step: 1,
  },
  reducers: {
    increment(state) {
      state.value += state.step
    },
    decrement(state) {
      state.value -= state.step
    },
    reset(state) {
      state.value = 0
      state.step = 1
    },
    setStep(state, action) {
      state.step = action.payload
    },
  },
})
```

Important:

`state.value += state.step` looks like mutation, but Redux Toolkit uses Immer internally, so the update remains immutable.

### Reading State With Selector

The component reads Redux state using a typed selector.

```ts
const count = useAppSelector((state) => state.counter.value)
const step = useAppSelector((state) => state.counter.step)
```

### Updating State With Dispatch

The component updates Redux state by dispatching actions.

```tsx
<button onClick={() => dispatch(increment())}>
  Increment
</button>
```

Interview summary:

The component does not directly change Redux state. It dispatches an action. The reducer handles the action and returns the next state. Then React re-renders with the selected state value.

## Core Redux Mental Model

Redux follows a one-way data flow.

```text
User interaction
      |
      v
Component dispatches action
      |
      v
Reducer receives current state + action
      |
      v
Reducer returns next state
      |
      v
Redux store updates
      |
      v
React components re-render with new state
```

Simple example:

```ts
const incrementAction = {
  type: "counter/increment",
}
```

The action describes **what happened**. The reducer decides **how state changes**.

```ts
type CounterState = {
  value: number
}

function counterReducer(
  state: CounterState = { value: 0 },
  action: { type: string },
) {
  if (action.type === "counter/increment") {
    return {
      value: state.value + 1,
    }
  }

  return state
}
```

## Important Redux Terms

### Store

The store is the central place where Redux state lives.

```text
Redux store
  |
  +-- auth
  +-- userPreferences
  +-- dashboardFilters
  +-- onboardingDraft
```

### Action

An action is a plain object that describes an event.

```ts
{
  type: "auth/loginSucceeded",
  payload: {
    userId: "user-101",
    role: "investor",
  },
}
```

### Reducer

A reducer is a pure function that receives the previous state and an action, then returns the next state.

```text
previous state + action -> reducer -> next state
```

Reducer rules:

- do not mutate existing state directly in plain Redux
- do not call APIs inside reducers
- do not use random values or side effects inside reducers
- return predictable next state

### Dispatch

Dispatch sends an action to the store.

```ts
dispatch({ type: "auth/logout" })
```

### Selector

A selector reads a specific part of Redux state.

```ts
const selectUserName = (state: RootState) => state.auth.user?.name
```

Selectors help components avoid knowing the entire store shape.

## Redux Data Flow Diagram

```text
React Component
  |
  | dispatch(loginSucceeded(user))
  v
Action
  |
  v
Reducer
  |
  v
Redux Store
  |
  | useSelector(selectUser)
  v
React Component re-renders
```

## Redux Toolkit

Redux Toolkit is the recommended way to write Redux today. It reduces boilerplate and gives better defaults.

Redux Toolkit provides:

- `configureStore`
- `createSlice`
- `createAsyncThunk`
- Immer-based immutable updates
- DevTools setup
- middleware defaults
- RTK Query

Interview answer:

Redux Toolkit is the modern standard for Redux. It makes Redux easier by reducing boilerplate, generating action creators automatically, and allowing simpler immutable update logic through Immer.

## Why Redux Toolkit Is Better Than Old Redux

Old Redux often required:

- action type constants
- action creator functions
- switch statements
- manual immutable updates
- manual middleware setup

Redux Toolkit simplifies this.

Old-style Redux:

```ts
const LOGIN_SUCCESS = "auth/loginSuccess"

function loginSuccess(user: User) {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

function authReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}
```

Redux Toolkit style:

```ts
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
})
```

Important:

In Redux Toolkit, this code looks like mutation, but it is safe because Immer creates immutable updates internally.

## What Is Immer?

Immer is a library that lets you write code that **looks like mutation**, but it safely produces **immutable updates** behind the scenes.

In React and Redux, we should avoid directly mutating state because React and Redux depend on immutability to detect changes correctly.

Direct mutation example:

```ts
state.user.name = "Karteek"
```

In plain React or old Redux, direct mutation can cause bugs because the object reference may not change.

Without Immer, immutable updates usually require object spreading:

```ts
return {
  ...state,
  name: action.payload,
}
```

With Redux Toolkit and Immer, inside a `createSlice` reducer, this is allowed:

```ts
const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "Karteek",
    role: "Developer",
  },
  reducers: {
    updateName(state, action) {
      state.name = action.payload
    },
  },
})
```

This line looks like mutation:

```ts
state.name = action.payload
```

But Immer converts it into a safe immutable update internally.

Mental model:

```text
Reducer code
  |
  | mutable-looking syntax
  v
Immer tracks the changes
  |
  v
Immer creates a new immutable state object
  |
  v
Redux store updates safely
```

Nested update without Immer:

```ts
return {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: "Hyderabad",
    },
  },
}
```

Nested update with Redux Toolkit and Immer:

```ts
state.user.address.city = "Hyderabad"
```

Why Immer is useful:

- reduces boilerplate
- makes nested updates easier
- prevents accidental mutation bugs
- improves reducer readability
- keeps Redux state immutable internally

Important interview line:

Immer allows us to write simpler update logic using mutable-looking syntax, but it still preserves immutability internally. Redux Toolkit uses Immer inside `createSlice`, so reducers become cleaner and less error-prone.

## Redux Toolkit Slice Diagram

```text
createSlice()
  |
  +-- slice name
  +-- initial state
  +-- reducers
        |
        +-- generates action creators
        +-- generates reducer function
```

## What State Should Go In Redux?

Good candidates:

- authenticated user summary
- permissions
- app-level settings
- selected organization/account
- global filters
- wizard state shared across many screens
- notifications

Usually avoid putting these in Redux:

- simple local form input
- modal open state used by one component
- derived data that can be calculated
- server cache that is better handled by RTK Query or TanStack Query

Interview answer:

I do not put everything in Redux. I keep local UI state in components, shared client state in Redux, and backend data in a server-state library like RTK Query.

## Essential State Vs Derived State

Essential state is the minimum source of truth.

```ts
const cartItems = [
  { id: 1, price: 100, quantity: 2 },
  { id: 2, price: 50, quantity: 1 },
]
```

Derived state can be calculated from essential state.

```ts
const total = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
)
```

Do not store `total` separately unless there is a strong reason. Storing derived state can create bugs when values become out of sync.

## Middleware

Middleware sits between dispatching an action and the reducer receiving it.

```text
Component
  |
  | dispatch(action)
  v
Middleware
  |
  +-- logging
  +-- async work
  +-- analytics
  +-- validation
  |
  v
Reducer
```

Examples:

- Redux Thunk
- Redux Saga
- RTK Query middleware
- logging middleware

## Redux Thunk

Redux Thunk allows action creators to return functions. This is useful for async logic.

```ts
function loadUser(userId: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(userLoading())

    try {
      const user = await fetchUser(userId)
      dispatch(userLoaded(user))
    } catch {
      dispatch(userFailed())
    }
  }
}
```

Interview answer:

Thunk is useful for straightforward async flows. For complex orchestration, teams may choose Redux Saga, but in modern Redux apps, RTK Query often handles API data better than writing thunks manually.

## Redux DevTools

Redux DevTools helps inspect:

- dispatched actions
- previous state
- next state
- state differences
- time-travel debugging

Diagram:

```text
Action 1 -> State 1
Action 2 -> State 2
Action 3 -> State 3

Redux DevTools lets you inspect each transition.
```

This is one reason Redux is useful in large teams and enterprise applications.

## RTK Query

RTK Query is part of Redux Toolkit. It is designed for server state: data that comes from backend APIs.

It handles:

- fetching
- loading state
- error state
- caching
- request deduplication
- refetching
- invalidation
- polling
- optimistic updates

Interview answer:

RTK Query is used for server state management. Instead of manually writing loading, success, error, cache, and retry logic for every API call, RTK Query generates hooks and manages API cache inside the Redux ecosystem.

## Client State Vs Server State

Client state is owned by the frontend.

Examples:

- selected tab
- theme
- sidebar open/closed
- selected filters
- auth UI state

Server state is owned by the backend.

Examples:

- user profile from API
- transactions
- onboarding status
- document verification result
- dashboard metrics

Diagram:

```text
React App
  |
  +-- Client state -> Redux slice / local state
  |
  +-- Server state -> RTK Query API cache
```

## RTK Query API Mental Model

```text
createApi()
  |
  +-- baseQuery
  |
  +-- endpoints
        |
        +-- query endpoints
        +-- mutation endpoints
        |
        +-- generated React hooks
```

Example:

```ts
const onboardingApi = createApi({
  reducerPath: "onboardingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<OnboardingStatus, string>({
      query: (userId) => `/onboarding/${userId}/status`,
    }),
    uploadDocument: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/documents",
        method: "POST",
        body: formData,
      }),
    }),
  }),
})
```

Generated hooks:

```ts
const {
  data,
  isLoading,
  isError,
  refetch,
} = useGetOnboardingStatusQuery(userId)

const [uploadDocument, uploadState] = useUploadDocumentMutation()
```

## Query Vs Mutation

Query:

- reads data
- usually cacheable
- example: get onboarding status

Mutation:

- changes data
- often invalidates cached queries
- example: upload document

Diagram:

```text
Query
  React -> GET status -> Server -> cached response

Mutation
  React -> POST document -> Server -> invalidate related cache
```

## RTK Query Cache

RTK Query stores API responses in a cache keyed by endpoint name and argument.

```text
useGetUserQuery("101")
  |
  v
Cache key: getUser("101")
  |
  v
Cached data reused by other components
```

If two components request the same data, RTK Query can reuse the cached result instead of making duplicate requests.

## Cache Invalidation

Invalidation tells RTK Query that some cached data is outdated.

Example:

```text
getOnboardingStatus provides tag: OnboardingStatus
uploadDocument invalidates tag: OnboardingStatus
```

Flow:

```text
User uploads document
      |
      v
Mutation succeeds
      |
      v
Invalidates OnboardingStatus cache
      |
      v
Status query refetches
      |
      v
UI shows latest status
```

Interview answer:

When a mutation changes backend data, RTK Query can invalidate related cached queries so the UI refetches fresh data automatically.

## RTK Query With Authentication

For protected APIs, attach the access token in headers.

```ts
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as RootState)

    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }

    return headers
  },
})
```

In an Auth0-based app, many teams get the access token from Auth0 and attach it before API calls. Exact implementation depends on the team's architecture.

## RTK Query Polling

RTK Query can poll an endpoint on an interval.

```ts
useGetOnboardingStatusQuery(userId, {
  pollingInterval: 5000,
})
```

Resume-based example:

For Stablehouse onboarding, polling can check POI, POA, or Liveness Verification status every few seconds until the result is approved, rejected, or retry required.

## RTK Query Optimistic Update

Optimistic update means updating the UI before the server confirms success.

Example:

```text
User clicks Like
  |
  v
UI immediately increments count
  |
  v
API request starts
  |
  +-- success -> keep UI
  |
  +-- failure -> rollback UI
```

RTK Query supports optimistic updates with `onQueryStarted`.

## Redux Vs Context API

Context API is good for passing stable global values.

Examples:

- theme
- locale
- logged-in user summary
- feature flags

Redux is better when:

- state updates frequently
- many components depend on different parts of state
- debugging and DevTools matter
- actions and reducers make transitions easier to understand
- app has complex shared state

Diagram:

```text
Context API
  |
  +-- simple global values

Redux
  |
  +-- complex shared state
  +-- predictable updates
  +-- DevTools
  +-- middleware
```

## Redux Vs RTK Query

Redux slices manage client state.

RTK Query manages server state.

```text
Redux slice
  |
  +-- auth UI state
  +-- selected filters
  +-- global settings

RTK Query
  |
  +-- API data
  +-- cache
  +-- loading/error
  +-- refetch/invalidation
```

Interview answer:

I would not store all API responses manually in Redux slices. For backend data, I would prefer RTK Query because it handles caching, deduping, refetching, and invalidation.

## Redux Toolkit Vs TanStack Query

Both can handle server state, but they fit different ecosystems.

| Topic | RTK Query | TanStack Query |
| --- | --- | --- |
| Ecosystem | Redux Toolkit | Standalone |
| Requires Redux | Yes | No |
| API style | `createApi` endpoints | `useQuery`, `useMutation` |
| Cache location | Redux store | Query client cache |
| Best fit | Existing Redux apps | Apps that do not need Redux |

Interview answer:

If the app already uses Redux Toolkit, RTK Query is a natural choice. If the app does not need Redux, TanStack Query is often simpler and framework-agnostic.

## Resume-Based Examples

Stablehouse FinTech onboarding:

- Redux can manage selected onboarding step, user role, feature flags, or shared UI state.
- RTK Query can fetch onboarding status, document verification result, and dynamic screen data.
- Mutations can upload POI/POA documents and invalidate onboarding status.
- Polling can refresh liveness verification status.

HNB Digital Lobby:

- Redux can manage global dashboard filters, selected branch/account, and shared UI state.
- RTK Query can fetch dashboard widgets, customer data, and transaction summaries.
- Cache invalidation can refresh widgets after updates.

## Common Interview Questions

What problem does Redux solve?

Redux solves predictable shared state management. It centralizes important state and makes changes traceable through actions and reducers.

What is Redux Toolkit?

Redux Toolkit is the recommended way to write Redux. It reduces boilerplate, sets up good defaults, and includes RTK Query.

What is a slice?

A slice is a group of Redux state plus reducers for one feature.

What is RTK Query?

RTK Query is a server-state library inside Redux Toolkit. It handles API fetching, caching, loading, errors, and invalidation.

When would you use Redux instead of Context?

Use Redux for complex, frequently updated shared state where debugging, middleware, and predictable transitions matter.

When would you use RTK Query?

Use RTK Query for backend data such as users, transactions, onboarding status, document status, and dashboard data.

Should all state go into Redux?

No. Keep local UI state local. Use Redux for shared client state. Use RTK Query for server state.

How does RTK Query cache data?

It stores results by endpoint and argument. If another component asks for the same data, RTK Query can reuse the cached response.

How does RTK Query refresh data after a mutation?

Use tags. Queries provide tags, and mutations invalidate tags. When a tag is invalidated, related queries can refetch.

## Common Mistakes

- Putting every small UI state into Redux.
- Storing derived values that can be calculated.
- Mutating state manually in old Redux.
- Writing manual API cache logic when RTK Query can handle it.
- Using Redux as a replacement for backend authorization.
- Forgetting loading, error, empty, and success states.
- Not using selectors.
- Overusing Context for frequently changing state.

## Quick Revision Notes

Redux is for predictable shared client state.

Redux Toolkit is the modern standard for Redux.

Reducers must be predictable.

Actions describe what happened.

Selectors read state.

Middleware handles work between dispatch and reducer.

RTK Query is for server state, API cache, refetching, and invalidation.

Do not put every state value in Redux.
