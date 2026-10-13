# TanStack Query Interview Guide

Purpose: quick learning, revision, and interview preparation for TanStack Query in React projects.

Important distinction:

> TanStack is not one framework that directly competes with Next.js.

TanStack is an ecosystem that contains multiple libraries/products:

- TanStack Query
- TanStack Router
- TanStack Table
- TanStack Virtual
- TanStack Start

For your resume and interview preparation, the main focus should be **TanStack Query**, also known earlier as **React Query**.

## 1. TanStack Ecosystem vs Next.js

TanStack Query and Next.js are not direct competitors.

TanStack Query solves **server-state management**:

- API fetching
- API caching
- background refetching
- loading/error states
- mutations
- cache invalidation
- pagination
- infinite queries
- query cancellation
- optimistic updates

Next.js is a **full-stack React framework** used to build complete applications with routing, rendering, server components, API routes/server functions, SSR, SSG, and deployment features.

### Visual Diagram

```text
React
 |
 +-- TanStack Query
 |      |
 |      +-- Server-state / API caching
 |
 +-- TanStack Router
 |      |
 |      +-- Type-safe routing
 |
 +-- TanStack Table
 |      |
 |      +-- Headless tables
 |
 +-- TanStack Virtual
 |      |
 |      +-- Large-list virtualization
 |
 +-- TanStack Start
        |
        +-- Full-stack React framework


React
 |
 +-- Next.js
        |
        +-- Full-stack React framework
```

### TanStack Query vs Next.js

They are not competitors.

You can use:

```text
Next.js
  +
TanStack Query
```

Example:

```text
Next.js handles:
- routing
- rendering
- server components
- application framework structure

TanStack Query handles:
- client-side API cache
- refetching
- loading and error states
- mutations
- invalidation
```

### TanStack Start vs Next.js

TanStack Start and Next.js are closer competitors because both are full-stack React frameworks.

```text
TanStack Start
  |
  +-- full-stack React framework
  +-- SSR
  +-- streaming
  +-- server functions
  +-- TanStack Router based

Next.js
  |
  +-- full-stack React framework
  +-- App Router
  +-- Server Components
  +-- SSR / SSG
  +-- large ecosystem
```

Interview answer:

> TanStack Query does not replace Next.js. TanStack Query manages server state and API caching. Next.js is a framework for building complete React applications. The TanStack product that is closer to Next.js is TanStack Start, not TanStack Query.

## 2. What Should You Learn First?

For interview preparation, use this priority:

| Technology | Priority | Suggested Depth |
| --- | ---: | --- |
| TanStack Query | Very high | Strong |
| Next.js | High | Working knowledge to strong |
| TanStack Table | Medium | Working knowledge |
| TanStack Router | Low to medium | Awareness |
| TanStack Virtual | Low to medium | Awareness |
| TanStack Start | Low to medium | Awareness for now |

Recommended learning path:

```text
Your Core
----------------
React
JavaScript
TypeScript
CSS
Redux Toolkit

        |
        v

Very Important Addition
-----------------------
TanStack Query

        |
        v

Career Expansion
----------------
Next.js

        |
        v

Optional / Emerging
-------------------
TanStack Start
TanStack Router
TanStack Table
TanStack Virtual
```

Interview answer:

> I would prioritize TanStack Query because it directly improves API handling in React applications. Next.js is also important as a framework skill, but I would not replace Next.js preparation with TanStack Start preparation right now.

## 3. Should TanStack Query Remain On Your Resume?

Yes, if you mean **TanStack Query / React Query**.

It is relevant for senior React roles because most enterprise React apps deal with backend data.

TanStack Query is designed for **server state**.

### Client State vs Server State

```text
Application State
        |
        +-------------------+
        |                   |
        v                   v
 Client State          Server State
        |                   |
        v                   v
 Redux Toolkit        TanStack Query
```

### Redux Toolkit Examples

Use Redux Toolkit for shared client-side application state:

```text
selectedAccount
user preferences
sidebar state
workflow step
logged-in user UI state
shared filters
```

### TanStack Query Examples

Use TanStack Query for backend/server data:

```text
GET clients
GET dashboard data
GET onboarding status
POST/PUT mutations
Caching
Refetching
Invalidation
Loading/error states
```

Interview answer:

> TanStack Query should remain on the resume if I can confidently explain it as a server-state library. It helps manage API data with caching, refetching, invalidation, loading states, error states, and mutations.

### Is TanStack Query Widely Used In Modern React Applications?

Yes. TanStack Query is widely adopted in the React ecosystem, particularly in applications that read and update significant amounts of backend data.

It is commonly used in:

- SaaS products
- dashboards and admin portals
- e-commerce applications
- social applications
- applications with pagination or infinite scrolling
- applications that need optimistic updates

It is popular because it handles server-state concerns that plain `fetch` and `useEffect` do not provide automatically:

- caching
- request deduplication
- loading and error states
- background refetching
- retries
- stale-data management
- mutations and cache invalidation
- pagination and infinite queries
- optimistic updates

```tsx
const { data, isPending, error } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
})
```

### When Is It A Good Choice?

```text
Few simple API requests
  -> fetch + useEffect may be enough

Repeated requests, caching, mutations, or pagination
  -> TanStack Query is usually valuable

Application already centered on Redux Toolkit
  -> RTK Query may integrate more naturally

GraphQL-heavy application
  -> Apollo Client or urql may be preferred

Next.js application
  -> Server Components can fetch initial server data
  -> TanStack Query can manage interactive client-side server state
```

TanStack Query does not replace every kind of state:

```text
Input value, modal state, selected tab
  -> local React state

Complex shared client workflow
  -> Redux Toolkit may be appropriate

Cached backend data
  -> TanStack Query
```

Real-time scenario:

An e-commerce application displays products on several screens. TanStack Query can reuse cached product data, avoid duplicate requests, refetch stale products in the background, update the cache after an order, and support optimistic cart or wishlist actions.

Interview answer:

> TanStack Query is widely used in modern React applications for server-state management. It is especially valuable when an application needs caching, request deduplication, background refetching, mutations, pagination, invalidation, or optimistic updates. It does not replace local UI state or every global-state solution; the choice depends on the application's data requirements and existing architecture.

## 4. Core Concepts To Master

Do not try to learn every feature at once. Master these:

1. `useQuery`
2. `useMutation`
3. Query keys
4. Query invalidation
5. Caching
6. `staleTime`
7. Refetching
8. Loading and error handling
9. Pagination and infinite queries
10. Query cancellation
11. Optimistic updates
12. Redux vs TanStack Query

The most important interview topics are:

```text
Queries
Mutations
Invalidation
Caching
staleTime
Query keys
Server state vs client state
```

## 5. What Is `useQuery`?

`useQuery` is used to fetch and cache server data.

### Example

```tsx
import { useQuery } from "@tanstack/react-query"

async function fetchUsers() {
  const response = await fetch("/api/users")

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}

function UsersList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  if (isLoading) {
    return <p>Loading users...</p>
  }

  if (isError) {
    return <p role="alert">{error.message}</p>
  }

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Explanation

```text
Component renders
      |
      v
useQuery runs queryFn
      |
      v
API returns data
      |
      v
TanStack Query stores data in cache
      |
      v
Component receives data
```

Interview answer:

> `useQuery` is used for fetching server data. It gives us loading, error, and success states, and it automatically caches the response based on the query key.

## 6. Query Keys

Query keys uniquely identify cached data.

### Simple Query Key

```tsx
useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
})
```

### Dynamic Query Key

```tsx
useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUserById(userId),
})
```

### Visual Diagram

```text
["users"]          -> cache for all users
["user", 10]       -> cache for user 10
["user", 20]       -> cache for user 20
["orders", page]   -> cache for each orders page
```

Interview answer:

> Query keys are like cache IDs. TanStack Query uses them to store, find, refetch, and invalidate specific API data.

## 7. What Is Caching?

Caching means storing API response data so the app does not need to refetch the same data unnecessarily.

### Visual Diagram

```text
First visit
----------
Component
   |
   v
API call
   |
   v
Data stored in Query Cache


Second visit
------------
Component
   |
   v
Reads cached data immediately
   |
   v
May refetch in background if stale
```

Interview answer:

> Caching means TanStack Query stores API responses by query key. When the user revisits a page, cached data can be shown immediately while TanStack Query decides whether to refetch in the background.

## 8. What Is `staleTime`?

`staleTime` controls how long cached data is considered fresh.

Example:

```tsx
useQuery({
  queryKey: ["dashboard"],
  queryFn: fetchDashboard,
  staleTime: 2 * 60 * 1000,
})
```

This means:

```text
2 * 60 * 1000 = 120000 ms = 2 minutes
```

For two minutes, the dashboard data is considered fresh.

### Visual Diagram

```text
API response received
        |
        v
Cache stores data
        |
        v
Fresh for 2 minutes
        |
        v
After 2 minutes, data becomes stale
        |
        v
TanStack Query may refetch when needed
```

Interview answer:

> `staleTime` defines how long cached data is treated as fresh. If data is fresh, TanStack Query does not need to refetch immediately. This helps reduce unnecessary API calls.

## 9. What Is `useMutation`?

`useMutation` is used for creating, updating, deleting, or submitting data.

### Example

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function uploadDocument(file) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/documents", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  return response.json()
}

function DocumentUpload() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })

  return (
    <input
      type="file"
      onChange={(event) => {
        const file = event.target.files?.[0]

        if (file) {
          mutation.mutate(file)
        }
      }}
    />
  )
}
```

### Explanation

```text
User uploads document
        |
        v
mutation.mutate(file)
        |
        v
POST /api/documents
        |
        v
Upload succeeds
        |
        v
Invalidate ["documents"]
        |
        v
Documents list refetches
```

Interview answer:

> `useMutation` is used for write operations like POST, PUT, PATCH, and DELETE. After a mutation succeeds, we usually invalidate related queries so the UI gets fresh data.

## 10. Query Invalidation

Invalidation means telling TanStack Query that cached data is no longer fresh.

Example:

```tsx
queryClient.invalidateQueries({ queryKey: ["users"] })
```

Use case:

```text
User updates profile
        |
        v
Mutation succeeds
        |
        v
Invalidate ["user", userId]
        |
        v
Profile query refetches
        |
        v
UI shows latest data
```

Interview answer:

> Query invalidation is used after data changes. For example, after creating or updating a record, I invalidate the related query key so TanStack Query can refetch and keep the UI synchronized with the backend.

## 11. Query Cancellation

TanStack Query can pass an `AbortSignal` to query functions. This is useful when a request becomes irrelevant.

### Search Example

```tsx
async function searchUsers({ queryKey, signal }) {
  const [, searchText] = queryKey

  const response = await fetch(`/api/users?search=${searchText}`, {
    signal,
  })

  return response.json()
}

function UserSearch({ searchText }) {
  const { data, isLoading } = useQuery({
    queryKey: ["users", searchText],
    queryFn: searchUsers,
    enabled: searchText.length > 2,
  })

  if (isLoading) {
    return <p>Searching...</p>
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

### Visual Diagram

```text
User types "kar"
      |
      v
Request A starts
      |
      v
User changes search to "kart"
      |
      v
Request A becomes less useful
      |
      v
AbortSignal can cancel old request
      |
      v
Request B starts
```

Interview answer:

> Query cancellation helps avoid updating the UI with old or irrelevant responses. It is especially useful in search, autocomplete, and filter screens.

## 12. TanStack Query With GraphQL

TanStack Query is not limited to REST APIs. It works with any Promise-based query function, including GraphQL clients.

### GraphQL Example

```tsx
import { request, gql } from "graphql-request"
import { useQuery } from "@tanstack/react-query"

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => request("/graphql", GET_USERS),
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Failed to load users</p>
  }

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Visual Diagram

```text
React Component
       |
       v
TanStack Query
       |
       v
GraphQL Client / Request
       |
       v
GraphQL API
       |
       v
Backend
```

Interview answer:

> TanStack Query can be used with REST or GraphQL because it only needs a Promise-returning function. For GraphQL, the query function can call Apollo Client, graphql-request, fetch, or another GraphQL client.

## 13. Pagination

Pagination means fetching data page by page instead of loading everything at once.

### Example

```tsx
function UsersPage({ page }) {
  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetch(`/api/users?page=${page}`).then((res) => res.json()),
    staleTime: 60 * 1000,
  })

  if (isLoading) {
    return <p>Loading page...</p>
  }

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Query Key Model

```text
["users", 1] -> page 1 cache
["users", 2] -> page 2 cache
["users", 3] -> page 3 cache
```

Interview answer:

> For pagination, I include the page number in the query key. That way each page has its own cached data.

## 14. Optimistic Updates

Optimistic update means updating the UI immediately before the server confirms success.

Use case:

```text
User clicks Like
        |
        v
UI immediately shows liked
        |
        v
API request runs
        |
        v
If success, keep UI
If failure, rollback UI
```

Interview answer:

> Optimistic updates improve perceived performance. We update the UI immediately, then rollback if the server request fails.

## 15. Redux Toolkit vs TanStack Query

Redux Toolkit and TanStack Query solve different problems.

### Visual Diagram

```text
State in React App
       |
       +----------------------+
       |                      |
       v                      v
Client State              Server State
       |                      |
       v                      v
Redux Toolkit             TanStack Query
```

### Redux Toolkit

Use for:

```text
selected tab
modal state
logged-in UI preferences
wizard step
cart state
client-only filters
shared form workflow state
```

### TanStack Query

Use for:

```text
API data
cached backend responses
loading states
error states
refetching
mutations
pagination
infinite scrolling
server synchronization
```

Interview answer:

> I do not see Redux Toolkit and TanStack Query as direct replacements. Redux Toolkit is good for client-side application state. TanStack Query is better for server state like API data, caching, refetching, mutations, and invalidation.

## 16. TanStack Query And Your Resume

For your resume, keep:

```text
TanStack Query / React Query
```

Do not add these unless you have real project experience:

```text
TanStack Start
TanStack Router
TanStack Table
TanStack Virtual
```

You can learn them later, but do not turn the resume into a list of libraries you cannot confidently defend.

### Resume-Relevant Example

For onboarding, POI, POA, or document verification flows:

```text
Dashboard loads onboarding status
        |
        v
useQuery(["onboarding-status"], fetchStatus)
        |
        v
User uploads POI document
        |
        v
useMutation(uploadDocument)
        |
        v
Invalidate ["onboarding-status"]
        |
        v
Dashboard refetches latest status
```

Interview explanation:

> In an onboarding project, I would use TanStack Query to fetch dashboard data, onboarding status, document status, and customer records. For POI or POA uploads, I would use `useMutation`, then invalidate related queries so the UI shows the latest verification status.

## 17. Next.js Learning Path

Next.js is still a valuable skill to learn after React, TypeScript, Redux Toolkit, and TanStack Query.

Recommended path:

```text
React 18/19
    |
    +-- Hooks
    +-- Rendering
    +-- Architecture
    +-- Performance
          |
          v
Redux Toolkit
          |
          v
TanStack Query
          |
          v
TypeScript
          |
          v
Next.js
    |
    +-- App Router
    +-- Server Components
    +-- Client Components
    +-- SSR
    +-- SSG
    +-- Routing
    +-- Data Fetching
    +-- Performance
          |
          v
Frontend Architecture
```

TanStack Start can come later as an emerging full-stack framework.

## 18. Strong Interview Answer To Memorize

Question:

> What is TanStack Query and why did you use it instead of Redux?

Answer:

> TanStack Query is mainly used for managing server state. In an enterprise React application, we have data coming from backend APIs that needs caching, refetching, synchronization, and loading/error handling. Instead of storing all that API data manually in Redux, TanStack Query handles those concerns for us. We still use Redux Toolkit when we need shared client-side application state. So I do not see Redux and TanStack Query as direct replacements. They solve different state-management problems.

Why this answer is strong:

- It separates server state from client state.
- It shows architecture understanding.
- It avoids saying one library always replaces the other.
- It fits enterprise React projects.
- It fits API-heavy flows like onboarding, POI, POA, dashboards, and document verification.

## 19. Quick Revision Questions

### What is TanStack Query?

TanStack Query is a server-state management library for React. It helps with fetching, caching, refetching, mutations, invalidation, loading states, and error states.

### Does TanStack Query replace Redux?

Not fully. TanStack Query handles server state. Redux Toolkit handles client state.

### What is a query key?

A query key is the unique cache identifier for API data.

### What is `staleTime`?

`staleTime` defines how long cached data is considered fresh.

### What is query invalidation?

Invalidation marks cached data as stale so TanStack Query can refetch updated data.

### What is `useMutation`?

`useMutation` is used for write operations like create, update, delete, upload, or submit.

### Can TanStack Query be used with GraphQL?

Yes. TanStack Query works with any Promise-returning function, including GraphQL clients.

### When would you use query cancellation?

For search, autocomplete, filters, or any request that may become irrelevant before it finishes.

### When would you use optimistic updates?

When you want the UI to update immediately, such as liking a post or updating a small status, then rollback if the API fails.

## 20. Bottom Line

Do not try to learn "TanStack" as one huge technology.

For your profile, prioritize:

```text
React
  |
  v
TypeScript
  |
  v
Redux Toolkit
  |
  v
TanStack Query
  |
  v
Next.js
```

Keep **TanStack Query** on the resume and become comfortable with its core concepts. Learn **Next.js** as the next major framework skill. Treat **TanStack Start** as an emerging technology worth watching, but not something you need to prioritize over Next.js right now.

## References

- TanStack Start overview: https://tanstack.com/start/latest/docs/framework/react/overview
- TanStack Query and client-state managers: https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state
- TanStack Query advanced SSR: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
- TanStack Query quick start: https://tanstack.com/query/latest/docs/framework/react/quick-start
- TanStack Query important defaults: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- TanStack Query cancellation: https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
- TanStack Query GraphQL: https://tanstack.com/query/latest/docs/framework/react/graphql
- TanStack Query installation: https://tanstack.com/query/v5/docs/framework/react/installation
- TanStack Start vs Next.js: https://tanstack.com/start/v0/docs/framework/react/start-vs-nextjs
