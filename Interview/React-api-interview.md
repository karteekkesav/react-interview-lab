# React API Interview Notes

Purpose: quick interview revision with simple JavaScript examples.

## API Handling In React

API handling means requesting data from a backend and showing correct UI states.

Minimum states:

```text
loading
success
error
empty
```

Interview answer:

When calling APIs in React, I handle loading, success, error, and empty states. For production apps, I prefer a server-state library like TanStack Query, RTK Query, Apollo, or SWR.

## Fetch Example

```jsx
import { useEffect, useState } from "react"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Failed to load users")
        }

        const data = await response.json()
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
  if (error) return <p role="alert">{error}</p>
  if (users.length === 0) return <p>No users found</p>

  return users.map((user) => <p key={user.id}>{user.name}</p>)
}
```

Interview answer:

`fetch` is built into the browser, but we need to manually check `response.ok`, parse JSON, and handle errors.

## Axios Example

Axios is a popular HTTP client library.

```jsx
import axios from "axios"

async function getUsers() {
  const response = await axios.get("/api/users")
  return response.data
}
```

Axios advantages:

- automatic JSON parsing
- request/response interceptors
- timeout support
- easier global configuration
- simpler error object

## Axios Interceptors

Interceptors let us run logic before requests or after responses.

Create client:

```jsx
import axios from "axios"

const httpClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
})
```

Request interceptor:

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

Response interceptor:

```jsx
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized. Logout or redirect user.")
    }

    if (error.response?.status >= 500) {
      console.log("Server error. Show common error message.")
    }

    return Promise.reject(error)
  },
)
```

Use API function:

```jsx
export async function getUsers() {
  const response = await httpClient.get("/users")
  return response.data
}
```

Interview answer:

Axios interceptors centralize auth headers, request IDs, error handling, and session expiry behavior so components do not repeat this logic.

## Fetch Vs Axios

```text
fetch
  |
  +-- built into browser
  +-- manual JSON parsing
  +-- manual response.ok check

axios
  |
  +-- library
  +-- automatic JSON parsing
  +-- interceptors
  +-- timeout and global config
```

Interview answer:

I choose based on team standards. `fetch` is enough for simple cases. Axios is useful when the app needs centralized interceptors, timeouts, and consistent error handling.

## REST

REST exposes resource-based endpoints.

```text
GET    /users
GET    /users/101
POST   /users
PUT    /users/101
DELETE /users/101
```

Example:

```jsx
async function getUser(userId) {
  const response = await fetch(`/api/users/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to load user")
  }

  return response.json()
}
```

Interview answer:

REST is simple and resource-based. It works well when endpoints map clearly to backend resources.

## POST Vs PUT

`POST` is usually used to create new data.

Example:

```jsx
async function createUser() {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Karteek",
      email: "karteek@example.com",
    }),
  })

  return response.json()
}
```

Meaning:

```text
Create a new user.
The backend usually generates the new id.
```

Example response:

```js
{
  id: 101,
  name: "Karteek",
  email: "karteek@example.com"
}
```

`PUT` is usually used to update or replace existing data.

Example:

```jsx
async function updateUser() {
  const response = await fetch("/api/users/101", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Karteek Kumar",
      email: "karteek@example.com",
    }),
  })

  return response.json()
}
```

Meaning:

```text
Update user with id 101.
The id is usually already known and is passed in the URL.
```

Simple difference:

```text
POST -> create new data
PUT  -> update or replace existing data
```

Real form example:

```text
User registration form -> POST /api/users
Edit profile form      -> PUT /api/users/101
```

Important interview point:

`POST` is usually not idempotent.

```text
Calling POST /api/users multiple times may create multiple users.
```

`PUT` is usually idempotent.

```text
Calling PUT /api/users/101 multiple times updates the same user with the same data.
It should not create duplicate users.
```

Interview answer:

`POST` is used to create a new resource, while `PUT` is used to update or replace an existing resource. `POST` usually creates a new id on the backend. `PUT` usually works with an existing id in the URL. `POST` is generally not idempotent, but `PUT` is generally idempotent.

## GraphQL

GraphQL lets the client request exactly the fields it needs.

## GraphQL In React Projects

GraphQL is an API query language. Instead of creating many REST endpoints, the backend usually exposes one GraphQL endpoint, and the frontend sends a query or mutation describing what data it needs.

Visual mental model:

```text
React Component
  |
  v
GraphQL client or fetch
  |
  v
POST /graphql
  |
  v
GraphQL server
  |
  v
Resolvers fetch data
  |
  v
JSON response returns to React
```

Interview answer:

In React projects, GraphQL is used when screens need flexible data fetching, nested data, or data from multiple backend resources. The client sends queries for reading data and mutations for creating/updating/deleting data.

## What Endpoint Is Used In GraphQL?

Most GraphQL APIs use a single endpoint.

Common endpoint names:

```text
/graphql
/api/graphql
/v1/graphql
/graphql/public
/graphql/admin
```

Example:

```text
https://api.example.com/graphql
```

Unlike REST:

```text
REST:
GET    /users
GET    /users/10
POST   /users
PUT    /users/10
DELETE /users/10

GraphQL:
POST /graphql
```

The operation is decided by the GraphQL body, not by many endpoint paths.

Interview answer:

In GraphQL, we usually call a single `/graphql` endpoint. The request body contains the operation, such as `query`, `mutation`, or `subscription`.

## How HTTP Methods Work In GraphQL

GraphQL does not use HTTP methods the same way REST does.

```text
REST
  |
  +-- GET /users
  +-- POST /users
  +-- PUT /users/1
  +-- DELETE /users/1

GraphQL
  |
  +-- query        -> read data
  +-- mutation     -> create/update/delete data
  +-- subscription -> real-time updates
```

Most GraphQL requests use HTTP `POST`.

```jsx
fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query GetUsers {
        users {
          id
          name
        }
      }
    `,
  }),
})
```

Can GraphQL use GET?

Yes, some servers allow `GET` for queries, especially for caching read-only operations.

```text
GET /graphql?query={users{id,name}}
```

But in most React apps, GraphQL calls are made using `POST` because it supports variables, large query bodies, and mutations cleanly.

Important:

```text
GraphQL query      -> usually POST, sometimes GET
GraphQL mutation   -> POST
GraphQL subscription -> WebSocket or SSE, depending on backend setup
```

Interview answer:

GraphQL mainly uses POST to a single endpoint. Instead of REST verbs, GraphQL uses operation types. `query` is for reading data, `mutation` is for changing data, and `subscription` is for real-time updates.

## GraphQL Request Body Format

A GraphQL HTTP request usually sends:

```json
{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name } }",
  "variables": {
    "id": "10"
  }
}
```

Meaning:

```text
query
  |
  +-- GraphQL operation string

variables
  |
  +-- dynamic values passed into the operation
```

## How To Write A Query

A query is used to read data.

```graphql
query GetOnboardingStatus {
  onboardingStatus {
    currentStep
    poiStatus
    poaStatus
    livenessStatus
  }
}
```

Another example:

```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    role
  }
}
```

Explanation:

```text
GetUser
  |
  +-- operation name

$userId: ID!
  |
  +-- variable
  +-- ID means identifier
  +-- ! means required

user(id: $userId)
  |
  +-- field resolver called on server

id name email role
  |
  +-- fields requested by frontend
```

Response:

```json
{
  "data": {
    "user": {
      "id": "10",
      "name": "Karteek",
      "email": "karteek@example.com",
      "role": "Senior Frontend Developer"
    }
  }
}
```

Interview answer:

In a GraphQL query, I request only the fields needed by the UI. I use variables for dynamic values like user ID, document ID, page number, or filters.

## How To Write A Mutation

A mutation is used to create, update, or delete data.

Example: update user profile.

```graphql
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
    email
  }
}
```

Variables:

```json
{
  "input": {
    "name": "Karteek",
    "email": "karteek@example.com"
  }
}
```

Example: upload POI/POA document metadata.

```graphql
mutation UploadDocument($input: UploadDocumentInput!) {
  uploadDocument(input: $input) {
    documentId
    documentType
    status
    uploadedAt
  }
}
```

Variables:

```json
{
  "input": {
    "userId": "user-101",
    "documentType": "POI",
    "fileName": "passport.pdf",
    "fileUrl": "https://s3.amazonaws.com/bucket/passport.pdf"
  }
}
```

### What Exactly Should We Pass As input?

In this mutation:

```graphql
mutation UploadDocument($input: UploadDocumentInput!) {
  uploadDocument(input: $input) {
    documentId
    documentType
    status
    uploadedAt
  }
}
```

We must pass a variable called `input`.

That `input` must match the backend-defined GraphQL type:

```graphql
UploadDocumentInput!
```

The `!` means the input is required.

Step-by-step meaning:

```text
mutation UploadDocument($input: UploadDocumentInput!)
  |
  +-- mutation name: UploadDocument
  +-- variable name: input
  +-- variable type: UploadDocumentInput
  +-- required: yes, because of !

uploadDocument(input: $input)
  |
  +-- call backend mutation uploadDocument
  +-- pass input variable to backend

documentId documentType status uploadedAt
  |
  +-- fields we want back in the response
```

The exact fields inside `input` are decided by the backend schema, not the frontend.

Example backend schema 1:

```graphql
input UploadDocumentInput {
  userId: ID!
  documentType: String!
  fileName: String!
  fileUrl: String!
}
```

Then the frontend variables must look like this:

```json
{
  "input": {
    "userId": "user-101",
    "documentType": "POI",
    "fileName": "passport.pdf",
    "fileUrl": "https://s3.amazonaws.com/bucket/passport.pdf"
  }
}
```

Example backend schema 2:

```graphql
input UploadDocumentInput {
  applicationId: ID!
  documentType: DocumentType!
  fileId: ID!
}
```

Then the frontend variables must look like this:

```json
{
  "input": {
    "applicationId": "app-789",
    "documentType": "POA",
    "fileId": "file-456"
  }
}
```

Example response:

```json
{
  "data": {
    "uploadDocument": {
      "documentId": "doc-123",
      "documentType": "POI",
      "status": "UPLOADED",
      "uploadedAt": "2026-07-28T10:30:00Z"
    }
  }
}
```

Interview answer:

`UploadDocumentInput` is not created by the frontend. It is defined in the GraphQL backend schema. I check GraphiQL, Apollo Sandbox, schema docs, or generated types to know which fields are required. Then I pass those values inside the `variables` object under the `input` key.

Interview answer:

I use mutations for operations that change backend data, such as submitting onboarding details, uploading document metadata, updating user profile, or deleting records.

## Calling GraphQL With fetch

This is the simplest way to understand GraphQL API calling.

```jsx
async function graphqlRequest(query, variables) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error("GraphQL request failed")
  }

  return result.data
}
```

Usage:

```jsx
const GET_USER = `
  query GetUser($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
    }
  }
`

async function loadUser() {
  const data = await graphqlRequest(GET_USER, {
    userId: "10",
  })

  console.log(data.user)
}
```

With auth token:

```jsx
async function graphqlRequest(query, variables, token) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result.data
}
```

Interview answer:

Even without Apollo, GraphQL can be called using normal `fetch`. We send a POST request to `/graphql` with `query` and `variables` in the request body.

## Apollo Client Configuration

Apollo Client is a common GraphQL client for React.

Install packages:

```text
npm install @apollo/client graphql
```

Create Apollo client:

```jsx
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
})

function AppRoot() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}
```

With auth token:

```jsx
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"

const httpLink = new HttpLink({
  uri: "/graphql",
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("access_token")

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  })

  return forward(operation)
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

Visual flow:

```text
React component
  |
  v
Apollo hook
  |
  v
Apollo Client
  |
  v
authLink adds token
  |
  v
httpLink sends request to /graphql
```

Interview answer:

I configure Apollo Client with the GraphQL endpoint, cache, and auth link. Then I wrap the React app with `ApolloProvider` so components can use GraphQL hooks.

## What Is InMemoryCache In Apollo?

`cache: new InMemoryCache()` creates Apollo Client's client-side cache.

```jsx
const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
})
```

Meaning:

```text
Apollo Client
  |
  +-- sends GraphQL request
  +-- receives response
  +-- stores response in InMemoryCache
  +-- reuses cached data when possible
```

Example query:

```graphql
query GetUser {
  user {
    id
    name
    email
  }
}
```

Example response:

```json
{
  "data": {
    "user": {
      "id": "1",
      "name": "Karteek",
      "email": "karteek@example.com"
    }
  }
}
```

Apollo can store normalized data roughly like this:

```text
User:1
  |
  +-- id: 1
  +-- name: Karteek
  +-- email: karteek@example.com
```

Why it helps in real projects:

```text
First page visit
  |
  v
API call happens
  |
  v
Data stored in cache

Navigate away and come back
  |
  v
Apollo can show cached data quickly
  |
  v
Apollo may refetch depending on fetch policy
```

Real project example:

```text
Dashboard loads onboarding status
  |
  v
Apollo stores status in cache

User opens POI screen
  |
  v
Same status data can be reused

User uploads POI
  |
  v
Mutation completes
  |
  v
Apollo cache can be refetched or updated
  |
  v
Dashboard shows updated POI status
```

Example:

```jsx
const { data, loading } = useQuery(GET_ONBOARDING_STATUS)
```

If this query already ran before, Apollo may return cached `data` immediately instead of waiting for a fresh network response.

After mutation:

```jsx
const [uploadDocument] = useMutation(UPLOAD_DOCUMENT, {
  refetchQueries: [{ query: GET_ONBOARDING_STATUS }],
})
```

This tells Apollo:

```text
After uploadDocument completes,
run GET_ONBOARDING_STATUS again
so cache has latest data.
```

Interview answer:

`InMemoryCache` is Apollo Client's normalized cache. It stores query results in browser memory, reduces repeated API calls, improves UI speed when navigating between screens, and helps keep related GraphQL data consistent. In real projects, after mutations like document upload or profile update, we either refetch queries or update the cache so the UI shows fresh data.

## GraphQL Hooks In React

Common Apollo hooks:

```text
useQuery
  |
  +-- fetch data immediately when component renders

useLazyQuery
  |
  +-- fetch data only when manually triggered

useMutation
  |
  +-- create, update, or delete data

useSubscription
  |
  +-- receive real-time updates

useApolloClient
  |
  +-- access Apollo client directly
```

## useQuery Example

```jsx
import { gql, useQuery } from "@apollo/client"

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

function UsersPage() {
  const { data, loading, error, refetch } = useQuery(GET_USERS)

  if (loading) return <p>Loading users...</p>
  if (error) return <p role="alert">Unable to load users</p>

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>

      {data.users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
```

Flow:

```text
Component renders
  |
  v
useQuery runs GET_USERS
  |
  v
loading = true
  |
  v
data returns
  |
  v
loading = false
  |
  v
UI shows users
```

## useQuery skip For Conditional Calls

Use `skip` when a query should run only after a required value is available.

Example:

```jsx
const { data } = useQuery(GET_USER, {
  variables: { id: userId },
  skip: !userId,
})
```

Line by line:

```jsx
const { data } = useQuery(...)
```

`useQuery` is Apollo's hook for calling a GraphQL query. `data` contains the API response after the query succeeds.

```jsx
GET_USER
```

This is the GraphQL query.

```jsx
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`
```

This query requires an `id`.

```jsx
variables: { id: userId }
```

This passes the React value `userId` into the GraphQL variable `$id`.

Example:

```js
userId = "10"
```

Apollo sends variables like this:

```json
{
  "id": "10"
}
```

Important part:

```jsx
skip: !userId
```

`skip` tells Apollo:

```text
skip is true  -> do not call the query
skip is false -> call the query
```

`!userId` means:

```text
userId missing -> !userId is true  -> skip query
userId exists  -> !userId is false -> run query
```

Examples:

```js
userId = undefined
skip = !undefined
skip = true
```

Result:

```text
API will not call
```

```js
userId = ""
skip = !""
skip = true
```

Result:

```text
API will not call
```

```js
userId = "10"
skip = !"10"
skip = false
```

Result:

```text
API will call
```

Why this is needed:

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
  }
}
```

`ID!` means `id` is required. If `userId` is `undefined` on the first render and we do not use `skip`, the query may fail because Apollo sends an invalid or missing required variable.

Complete component example:

```jsx
function UserDetails({ selectedUserId }) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: selectedUserId },
    skip: !selectedUserId,
  })

  if (!selectedUserId) return <p>Please select a user</p>
  if (loading) return <p>Loading user...</p>
  if (error) return <p role="alert">Unable to load user</p>

  return <p>{data.user.name}</p>
}
```

Flow:

```text
First render
  |
  v
selectedUserId is empty
  |
  v
skip: true
  |
  v
No API call
  |
  v
Show "Please select a user"

User selects id = "10"
  |
  v
component re-renders
  |
  v
skip: false
  |
  v
API call happens
  |
  v
User data shown
```

Interview answer:

`skip` prevents a GraphQL query from running until required values are available. It is useful when a query depends on route params, selected dropdown values, logged-in user ID, or search input. In this example, `GET_USER` runs only when `userId` exists, which avoids unnecessary API calls and prevents errors from sending undefined variables to required GraphQL fields.

### Passing selectedUserId Using React Router

In real React apps, we often pass an ID through the URL route parameter instead of passing props across unrelated screens.

Flow:

```text
UsersList page
  |
  | user clicks "View Details"
  v
Navigate to /users/10
  |
  v
UserDetails page reads userId from URL using useParams()
  |
  v
useQuery(GET_USER, { variables: { id: userId } })
```

Imports:

```jsx
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom"
import { gql, useQuery } from "@apollo/client"
```

GraphQL query:

```jsx
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`
```

Users list component:

```jsx
function UsersList() {
  const users = [
    { id: "1", name: "Karteek" },
    { id: "2", name: "React Developer" },
  ]

  return (
    <div>
      <h2>Users</h2>

      {users.map((user) => (
        <p key={user.id}>
          {user.name}{" "}
          <Link to={`/users/${user.id}`}>View Details</Link>
        </p>
      ))}
    </div>
  )
}
```

This line creates the route URL:

```jsx
<Link to={`/users/${user.id}`}>View Details</Link>
```

Examples:

```text
Click Karteek          -> /users/1
Click React Developer  -> /users/2
```

User details component:

```jsx
function UserDetails() {
  const { userId } = useParams()

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  })

  if (!userId) return <p>User id is missing</p>
  if (loading) return <p>Loading user...</p>
  if (error) return <p role="alert">Unable to load user</p>

  return (
    <div>
      <h2>User Details</h2>
      <p>ID: {data.user.id}</p>
      <p>Name: {data.user.name}</p>
      <p>Email: {data.user.email}</p>
    </div>
  )
}
```

This line reads the ID from the URL:

```jsx
const { userId } = useParams()
```

For this route:

```jsx
<Route path="/users/:userId" element={<UserDetails />} />
```

If URL is:

```text
/users/1
```

then:

```js
userId = "1"
```

App routes:

```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:userId" element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  )
}
```

Complete flow:

```text
User visits /users
  |
  v
UsersList renders
  |
  v
User clicks View Details for id 1
  |
  v
React Router navigates to /users/1
  |
  v
UserDetails renders
  |
  v
useParams() returns { userId: "1" }
  |
  v
useQuery sends GraphQL variable { id: "1" }
  |
  v
API returns user details
```

Interview answer:

In a routed React app, I usually pass IDs through route params instead of passing props across unrelated screens. For example, the list page navigates to `/users/:userId`, and the details page reads `userId` using `useParams()`. Then I pass that `userId` as a GraphQL variable to `useQuery`. This keeps the URL shareable, supports browser refresh, and avoids unnecessary prop drilling.

## useLazyQuery Example

Use `useLazyQuery` when the API should run only after a user action.

```jsx
import { gql, useLazyQuery } from "@apollo/client"

const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    searchUsers(search: $search) {
      id
      name
    }
  }
`

function UserSearch() {
  const [search, setSearch] = useState("")
  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USERS)

  function handleSearch() {
    searchUsers({
      variables: {
        search,
      },
    })
  }

  return (
    <div>
      <input value={search} onChange={(event) => setSearch(event.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Searching...</p>}
      {error && <p role="alert">Search failed</p>}

      {data?.searchUsers.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
```

Interview answer:

`useQuery` runs automatically. `useLazyQuery` waits until we call the function returned by the hook.

### useLazyQuery Code Explanation

`useLazyQuery` is used when we do not want the API to call automatically on component render. Instead, we want to call it manually after a user action, such as clicking a search button.

Imports:

```jsx
import { gql, useLazyQuery } from "@apollo/client"
```

Meaning:

```text
gql
  |
  +-- used to write GraphQL query

useLazyQuery
  |
  +-- Apollo hook
  +-- query does not run automatically
  +-- returns a function to manually trigger the query
```

GraphQL query:

```jsx
const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    searchUsers(search: $search) {
      id
      name
    }
  }
`
```

Step by step:

```graphql
query SearchUsers($search: String!)
```

This defines a query named `SearchUsers`.

```text
$search
  |
  +-- variable name

String!
  |
  +-- value must be a string
  +-- ! means required
```

```graphql
searchUsers(search: $search)
```

This calls the backend field `searchUsers` and passes the variable.

Example:

```js
search = "kar"
```

Apollo sends variables:

```json
{
  "search": "kar"
}
```

Fields:

```graphql
id
name
```

These are the fields we want back for each matching user.

Example response:

```json
{
  "data": {
    "searchUsers": [
      {
        "id": "1",
        "name": "Karteek"
      }
    ]
  }
}
```

Component state:

```jsx
const [search, setSearch] = useState("")
```

This stores the input value.

Initially:

```js
search = ""
```

Important line:

```jsx
const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USERS)
```

`useLazyQuery` returns an array:

```text
First value:
searchUsers
  |
  +-- function used to manually call API

Second value:
{ data, loading, error }
  |
  +-- query result state
```

Unlike `useQuery`, this does not call the API immediately.

Manual trigger:

```jsx
function handleSearch() {
  searchUsers({
    variables: {
      search,
    },
  })
}
```

When the user clicks Search, this function runs and passes:

```js
{
  search: "kar"
}
```

Then Apollo calls the GraphQL API.

Controlled input:

```jsx
<input value={search} onChange={(event) => setSearch(event.target.value)} />
```

When the user types:

```text
k
ka
kar
```

React state updates:

```js
search = "kar"
```

But the API is still not called while typing.

Button:

```jsx
<button onClick={handleSearch}>Search</button>
```

The API is called only when this button is clicked.

Loading UI:

```jsx
{loading && <p>Searching...</p>}
```

When the API call is in progress, the UI shows:

```text
Searching...
```

Error UI:

```jsx
{error && <p role="alert">Search failed</p>}
```

If the API fails, the UI shows:

```text
Search failed
```

Render data:

```jsx
{data?.searchUsers.map((user) => (
  <p key={user.id}>{user.name}</p>
))}
```

`data?.searchUsers` means:

```text
If data exists, read searchUsers.
If data is undefined, do not crash.
```

This is needed because before the first search, `data` is undefined.

Flow:

```text
Component renders
  |
  v
useLazyQuery is prepared
  |
  v
No API call yet
  |
  v
User types "kar"
  |
  v
search state updates
  |
  v
Still no API call
  |
  v
User clicks Search
  |
  v
searchUsers({ variables: { search: "kar" } })
  |
  v
Apollo sends POST /graphql
  |
  v
loading = true
  |
  v
Response comes back
  |
  v
data.searchUsers is filled
  |
  v
Users render on screen
```

Difference:

```text
useQuery
  |
  +-- runs automatically when component renders

useLazyQuery
  |
  +-- waits until we manually call the returned function
```

When to use `useLazyQuery`:

```text
Search button click
Filter apply button
Export/download action
Load details on demand
Modal opens and then load data
Dependent query after user action
```

Interview answer:

`useLazyQuery` is useful when we do not want the GraphQL query to run immediately on component render. It returns a trigger function and query state. In this example, the user can type in the search box without calling the API. The API runs only when the user clicks the Search button, and Apollo provides loading, error, and data states for the UI.

## Cancel Previous Apollo Request With Debounced Search

For search/autocomplete, avoid calling the API directly on every keystroke.

Better pattern:

```text
User types "k"   -> wait
User types "ka"  -> clear previous timer
User types "kar" -> clear previous timer
User stops typing
API call runs after debounce delay
```

If an old API request is already running, we can cancel it using `AbortController`.

```jsx
import { gql, useLazyQuery } from "@apollo/client"
import { useEffect, useRef, useState } from "react"

const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    searchUsers(search: $search) {
      id
      name
      email
    }
  }
`

function UserSearch() {
  const [searchText, setSearchText] = useState("")
  const abortControllerRef = useRef(null)

  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USERS)

  useEffect(() => {
    if (!searchText.trim()) {
      return
    }

    const timerId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      searchUsers({
        variables: {
          search: searchText,
        },
        context: {
          fetchOptions: {
            signal: controller.signal,
          },
        },
      })
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchText, searchUsers])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div>
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search users"
      />

      {loading && <p>Searching...</p>}
      {error && <p role="alert">Search failed</p>}

      {data?.searchUsers.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
```

Important lines:

```jsx
const abortControllerRef = useRef(null)
```

This stores the previous request controller without causing a re-render.

Before starting a new request:

```jsx
if (abortControllerRef.current) {
  abortControllerRef.current.abort()
}
```

This cancels the previous running request.

Create a new controller for the latest request:

```jsx
const controller = new AbortController()
abortControllerRef.current = controller
```

Pass the signal to Apollo:

```jsx
context: {
  fetchOptions: {
    signal: controller.signal,
  },
}
```

Apollo uses HTTP under the hood, so the `signal` can cancel the fetch request when Apollo is using an HTTP link based on `fetch`.

Cleanup on unmount:

```jsx
useEffect(() => {
  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }
}, [])
```

This cancels the request if the user leaves the page before the API returns.

Flow:

```text
User types
  |
  v
searchText changes
  |
  v
useEffect starts debounce timer
  |
  v
User keeps typing
  |
  v
previous timer is cleared
  |
  v
User stops typing for 500ms
  |
  v
old API request is aborted
  |
  v
new API request starts with latest search text
```

Interview answer:

For Apollo search APIs, I usually combine debouncing with request cancellation. Debouncing avoids firing the API on every keystroke. If a previous request is already running, I use `AbortController`, store it in a ref, abort the old request before starting the new one, and pass the new `signal` through Apollo's `context.fetchOptions`. This ensures the latest search request is the one that matters.

## useMutation Example

```jsx
import { gql, useMutation } from "@apollo/client"

const ADD_USER = gql`
  mutation AddUser($input: AddUserInput!) {
    addUser(input: $input) {
      id
      name
      email
    }
  }
`

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

function AddUserForm() {
  const [name, setName] = useState("")

  const [addUser, { loading, error }] = useMutation(ADD_USER, {
    refetchQueries: [{ query: GET_USERS }],
  })

  async function handleSubmit(event) {
    event.preventDefault()

    await addUser({
      variables: {
        input: {
          name,
          email: `${name.toLowerCase()}@example.com`,
        },
      },
    })

    setName("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(event) => setName(event.target.value)} />

      <button disabled={loading}>
        {loading ? "Saving..." : "Add User"}
      </button>

      {error && <p role="alert">Unable to add user</p>}
    </form>
  )
}
```

Interview answer:

`useMutation` returns a function that we call when the user submits a form or clicks a button. After mutation, we can refetch queries or update Apollo cache.

### useMutation Code Explanation

`useMutation` is used when we want to change data on the backend.

Examples:

```text
add user
update user
delete user
upload document
submit onboarding form
like a post
```

Local input state:

```jsx
const [name, setName] = useState("")
```

This stores the input field value.

Initially:

```js
name = ""
```

Important line:

```jsx
const [addUser, { loading, error }] = useMutation(ADD_USER, {
  refetchQueries: [{ query: GET_USERS }],
})
```

`useMutation` returns an array:

```text
First value:
addUser
  |
  +-- function used to call the mutation

Second value:
{ loading, error }
  |
  +-- mutation status
```

Important:

`addUser` is not the response data. It is a function. We call it when the user submits the form.

Refetch after mutation:

```jsx
refetchQueries: [{ query: GET_USERS }]
```

This means:

```text
After ADD_USER mutation completes,
run GET_USERS query again
so the users list has latest data.
```

Flow:

```text
Current users list
  |
  v
User adds new user
  |
  v
ADD_USER mutation runs
  |
  v
Backend saves new user
  |
  v
GET_USERS query runs again
  |
  v
UI shows updated users list
```

Submit handler:

```jsx
async function handleSubmit(event) {
  event.preventDefault()
```

`event.preventDefault()` stops the browser from refreshing the page when the form submits.

Without it:

```text
Submit form
  |
  v
Browser reloads page
```

With it:

```text
Submit form
  |
  v
React handles submit
```

Calling mutation:

```jsx
await addUser({
  variables: {
    input: {
      name,
      email: `${name.toLowerCase()}@example.com`,
    },
  },
})
```

This calls the GraphQL mutation and sends variables.

If the user types:

```text
Karteek
```

Variables become:

```json
{
  "input": {
    "name": "Karteek",
    "email": "karteek@example.com"
  }
}
```

This should match the GraphQL mutation input:

```graphql
mutation AddUser($input: AddUserInput!) {
  addUser(input: $input) {
    id
    name
    email
  }
}
```

Meaning:

```text
AddUserInput!
  |
  +-- required input object
```

After mutation:

```jsx
setName("")
```

This clears the input field.

Form:

```jsx
<form onSubmit={handleSubmit}>
```

When the user submits the form, `handleSubmit` runs.

Controlled input:

```jsx
<input value={name} onChange={(event) => setName(event.target.value)} />
```

Flow:

```text
User types
  |
  v
onChange runs
  |
  v
setName updates state
  |
  v
input value comes from name state
```

Button:

```jsx
<button disabled={loading}>
  {loading ? "Saving..." : "Add User"}
</button>
```

When mutation is running:

```text
loading = true
```

Button becomes disabled and shows:

```text
Saving...
```

When mutation is not running:

```text
loading = false
```

Button shows:

```text
Add User
```

Error UI:

```jsx
{error && <p role="alert">Unable to add user</p>}
```

If mutation fails, Apollo gives `error`, and the UI shows:

```text
Unable to add user
```

`role="alert"` helps accessibility and testing.

Full flow:

```text
Component renders
  |
  v
name = ""
  |
  v
User types "Karteek"
  |
  v
setName("Karteek")
  |
  v
User submits form
  |
  v
handleSubmit runs
  |
  v
event.preventDefault()
  |
  v
addUser mutation runs with variables
  |
  v
loading = true
  |
  v
Backend creates user
  |
  v
GET_USERS refetches
  |
  v
loading = false
  |
  v
setName("")
  |
  v
Input clears
```

Interview answer:

`useMutation` is used for GraphQL operations that change backend data. It returns a mutation function and status values like `loading` and `error`. We call the mutation function inside an event handler, pass variables, handle loading/error UI, and after success we either refetch related queries or update Apollo cache so the UI stays in sync.

## useSubscription Example

Subscriptions are used for real-time updates.

```jsx
import { gql, useSubscription } from "@apollo/client"

const ON_NOTIFICATION = gql`
  subscription OnNotification {
    notificationReceived {
      id
      message
      createdAt
    }
  }
`

function Notifications() {
  const { data, loading } = useSubscription(ON_NOTIFICATION)

  if (loading) return <p>Waiting for notifications...</p>

  return <p>{data.notificationReceived.message}</p>
}
```

Interview answer:

Subscriptions are useful for real-time data like notifications, chat messages, live status updates, or verification status updates. The backend usually uses WebSocket or SSE for this.

### useSubscription Code Explanation

GraphQL subscriptions are used when the frontend needs real-time updates from the backend.

Example use cases:

```text
new notification
chat message
live order status
payment status
document verification status
liveness verification status
```

Imports:

```jsx
import { gql, useSubscription } from "@apollo/client"
```

Meaning:

```text
gql
  |
  +-- used to write GraphQL operation

useSubscription
  |
  +-- Apollo hook for real-time GraphQL subscriptions
```

Subscription definition:

```jsx
const ON_NOTIFICATION = gql`
  subscription OnNotification {
    notificationReceived {
      id
      message
      createdAt
    }
  }
`
```

Line by line:

```graphql
subscription OnNotification {
```

This defines a GraphQL subscription operation.

```text
subscription
  |
  +-- operation type for real-time data

OnNotification
  |
  +-- operation name
  +-- useful for debugging and tooling
```

```graphql
notificationReceived {
```

This is the backend subscription field.

The backend schema may define:

```graphql
type Subscription {
  notificationReceived: Notification!
}
```

Meaning:

```text
Whenever a new notification is created,
backend pushes notification data to subscribed clients.
```

Requested fields:

```graphql
id
message
createdAt
```

These are the fields we want when a notification arrives.

Example pushed data:

```json
{
  "data": {
    "notificationReceived": {
      "id": "n-101",
      "message": "POI document verified",
      "createdAt": "2026-07-28T10:30:00Z"
    }
  }
}
```

Component:

```jsx
function Notifications() {
```

This React component displays the latest notification.

```jsx
const { data, loading } = useSubscription(ON_NOTIFICATION)
```

This starts listening to the subscription.

Important difference:

```text
useQuery
  |
  +-- request data once

useSubscription
  |
  +-- keep connection open
  +-- receive data whenever backend pushes updates
```

When component renders:

```text
Notifications component renders
  |
  v
useSubscription starts listening
  |
  v
Apollo opens subscription connection
  |
  v
Backend sends updates when events happen
```

Loading state:

```jsx
if (loading) return <p>Waiting for notifications...</p>
```

Initially, Apollo is preparing the subscription connection.

UI shows:

```text
Waiting for notifications...
```

Render notification:

```jsx
return <p>{data.notificationReceived.message}</p>
```

When backend sends data, `data` becomes available.

Example:

```js
data = {
  notificationReceived: {
    id: "n-101",
    message: "POI document verified",
    createdAt: "2026-07-28T10:30:00Z"
  }
}
```

Then UI shows:

```text
POI document verified
```

Full flow:

```text
Component renders
  |
  v
useSubscription(ON_NOTIFICATION)
  |
  v
Apollo connects to subscription server
  |
  v
UI shows "Waiting for notifications..."
  |
  v
Backend event happens
  |
  v
Backend pushes notification
  |
  v
Apollo receives data
  |
  v
Component re-renders
  |
  v
UI shows notification message
```

In real projects, this needs backend subscription setup.

Common transport:

```text
GraphQL subscriptions
  |
  +-- WebSocket commonly used
  +-- SSE possible in some setups
```

Apollo WebSocket setup concept:

```jsx
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  }),
)
```

Apollo can use:

```text
HTTP link
  |
  +-- query
  +-- mutation

WebSocket link
  |
  +-- subscription
```

Real-time onboarding example:

```text
User uploads POI document
  |
  v
Backend starts verification
  |
  v
Frontend subscribes to verification status
  |
  v
Backend pushes "VERIFIED" or "REJECTED"
  |
  v
UI updates automatically
```

Interview answer:

`useSubscription` is used for real-time GraphQL updates. Unlike `useQuery`, which fetches data once, `useSubscription` keeps a connection open and listens for backend events. It is useful for notifications, chat messages, live dashboards, document verification status, and liveness verification updates. In most projects, GraphQL subscriptions are implemented over WebSockets.

## Mock GraphQL API For Learning

For interview preparation, you can understand GraphQL without a real backend by mocking responses.

Simple mock function:

```jsx
function mockGraphqlRequest(query, variables) {
  console.log("GraphQL query:", query)
  console.log("GraphQL variables:", variables)

  return Promise.resolve({
    data: {
      user: {
        id: variables.userId,
        name: "Karteek",
        email: "karteek@example.com",
      },
    },
  })
}
```

Usage:

```jsx
const GET_USER = `
  query GetUser($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
    }
  }
`

mockGraphqlRequest(GET_USER, { userId: "10" }).then((result) => {
  console.log(result.data.user)
})
```

Console output:

```text
GraphQL query: query GetUser...
GraphQL variables: { userId: "10" }

{
  id: "10",
  name: "Karteek",
  email: "karteek@example.com"
}
```

## Mock GraphQL With MSW

MSW can mock GraphQL queries and mutations in tests.

```js
import { graphql, HttpResponse } from "msw"

export const handlers = [
  graphql.query("GetUsers", () => {
    return HttpResponse.json({
      data: {
        users: [
          { id: "1", name: "Karteek", email: "karteek@example.com" },
        ],
      },
    })
  }),

  graphql.mutation("AddUser", async ({ variables }) => {
    return HttpResponse.json({
      data: {
        addUser: {
          id: "2",
          name: variables.input.name,
          email: variables.input.email,
        },
      },
    })
  }),
]
```

Interview answer:

For testing GraphQL components, I prefer MSW because the component still calls the real GraphQL client, but MSW returns controlled query or mutation responses.

## Real-Time Mock Scenario: Onboarding Dashboard

Imagine an onboarding dashboard with POI, POA, and liveness verification.

Query:

```graphql
query GetOnboardingStatus($userId: ID!) {
  onboardingStatus(userId: $userId) {
    currentStep
    poiStatus
    poaStatus
    livenessStatus
  }
}
```

Mutation:

```graphql
mutation UploadDocument($input: UploadDocumentInput!) {
  uploadDocument(input: $input) {
    documentId
    documentType
    status
  }
}
```

React flow:

```text
Page loads
  |
  v
useQuery(GetOnboardingStatus)
  |
  v
Show POI/POA/Liveness status
  |
  v
User uploads document
  |
  v
useMutation(UploadDocument)
  |
  v
Refetch onboarding status
  |
  v
Dashboard updates
```

Component idea:

```jsx
function OnboardingDashboard({ userId }) {
  const { data, loading, error, refetch } = useQuery(GET_ONBOARDING_STATUS, {
    variables: { userId },
  })

  const [uploadDocument, { loading: uploading }] = useMutation(UPLOAD_DOCUMENT, {
    onCompleted: () => {
      refetch()
    },
  })

  if (loading) return <p>Loading onboarding status...</p>
  if (error) return <p role="alert">Unable to load onboarding status</p>

  async function handleUpload() {
    await uploadDocument({
      variables: {
        input: {
          userId,
          documentType: "POI",
          fileName: "passport.pdf",
        },
      },
    })
  }

  return (
    <div>
      <p>Current step: {data.onboardingStatus.currentStep}</p>
      <p>POI: {data.onboardingStatus.poiStatus}</p>
      <p>POA: {data.onboardingStatus.poaStatus}</p>
      <p>Liveness: {data.onboardingStatus.livenessStatus}</p>

      <button disabled={uploading} onClick={handleUpload}>
        {uploading ? "Uploading..." : "Upload POI"}
      </button>
    </div>
  )
}
```

Interview answer:

In an onboarding dashboard, I would use a query to load status and mutations for document upload or form submission. After successful mutation, I would refetch or update cache so the dashboard shows the latest status.

## GraphQL Dashboards And Tools

Tools used to write, test, and customize GraphQL queries:

```text
GraphiQL
  |
  +-- browser-based GraphQL IDE
  +-- shows schema docs
  +-- run queries and mutations

Apollo Sandbox / Apollo Studio Explorer
  |
  +-- query builder
  +-- schema explorer
  +-- variables panel
  +-- operation history

GraphQL Playground
  |
  +-- older GraphQL IDE
  +-- still used in some projects

Postman / Insomnia
  |
  +-- can send GraphQL requests
  +-- useful for API testing

Altair GraphQL Client
  |
  +-- GraphQL IDE alternative
```

What you can do in these dashboards:

```text
Explore schema
Find available queries and mutations
Check required variables
Customize selected fields
Run operation
Inspect response
Copy query into React app
```

Example workflow:

```text
Open Apollo Sandbox or GraphiQL
  |
  v
Check schema docs
  |
  v
Select query: onboardingStatus
  |
  v
Choose fields: currentStep, poiStatus, poaStatus
  |
  v
Add variables: userId
  |
  v
Run query
  |
  v
Copy query into React component
```

Interview answer:

I use tools like GraphiQL, Apollo Sandbox, Postman, or Insomnia to inspect the schema, test queries/mutations, check required variables, and customize the fields needed by the UI.

## GraphQL Best Practices In React

- Use operation names like `GetUser`, `UploadDocument`, or `GetOnboardingStatus`.
- Use variables instead of string concatenation.
- Request only fields needed by the UI.
- Handle `loading`, `error`, empty, and success states.
- Centralize Apollo Client configuration.
- Add auth tokens through an Apollo link or request wrapper.
- Use fragments for repeated field selections.
- Use generated TypeScript types in larger projects.
- Refetch or update cache after mutations.
- Avoid putting sensitive data in frontend queries.
- Validate permissions on the backend.

Fragment example:

```graphql
fragment UserFields on User {
  id
  name
  email
}

query GetUsers {
  users {
    ...UserFields
  }
}
```

Interview answer:

Fragments help avoid repeating the same field selection in multiple queries.

## Complete GraphQL Interview Summary

```text
Endpoint
  |
  +-- usually POST /graphql

Read data
  |
  +-- query

Change data
  |
  +-- mutation

Real-time data
  |
  +-- subscription

React hooks
  |
  +-- useQuery
  +-- useLazyQuery
  +-- useMutation
  +-- useSubscription

Tools
  |
  +-- GraphiQL
  +-- Apollo Sandbox / Studio Explorer
  +-- Postman
  +-- Insomnia
```

Interview answer:

GraphQL is useful when screens need data from multiple backend resources or need precise field selection. In Stablehouse onboarding, GraphQL fits workflows like document upload, onboarding status, and dynamic screen rendering.

## API Failures

Handle:

- network failure
- `401` unauthorized
- `403` forbidden
- `404` not found
- `500` server error
- timeout
- validation errors

Example:

```jsx
try {
  const data = await getUsers()
  setUsers(data)
} catch (error) {
  setError("Unable to load users. Please try again.")
}
```

Interview answer:

The UI should not break when an API fails. It should show a clear error message, allow retry when appropriate, and log the issue for debugging.

## Retry Mechanism

Simple retry:

```jsx
async function fetchWithRetry(url, retries = 2) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Request failed")
    }

    return response.json()
  } catch (error) {
    if (retries === 0) {
      throw error
    }

    return fetchWithRetry(url, retries - 1)
  }
}
```

Interview answer:

Retry is useful for temporary failures, but should be limited. Do not blindly retry validation errors or unauthorized requests.

## Cancel Stale Requests With AbortController

Use `AbortController` to cancel old requests.

```jsx
import { useEffect, useState } from "react"

function SearchResults({ query }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadResults() {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal,
      })

      const data = await response.json()
      setResults(data)
    }

    loadResults().catch((error) => {
      if (error.name !== "AbortError") {
        console.log("Search failed")
      }
    })

    return () => controller.abort()
  }, [query])

  return results.map((item) => <p key={item.id}>{item.name}</p>)
}
```

Interview answer:

If the user changes search quickly, older requests should be cancelled so stale responses do not overwrite newer UI.

## Request-Response Cycle

```text
React client
  |
  | request
  v
Server
  |
  | response
  v
React client
```

Best for:

- form submit
- normal fetch
- document upload
- login
- dashboard data

Limitation:

The server cannot push updates unless the client asks again or uses a real-time pattern.

## Polling

Polling means asking the backend repeatedly.

```jsx
useEffect(() => {
  const intervalId = setInterval(() => {
    fetch("/api/onboarding/status")
      .then((res) => res.json())
      .then(setStatus)
  }, 5000)

  return () => clearInterval(intervalId)
}, [])
```

Interview answer:

Polling is simple and useful when backend does not support push updates. For POI/POA verification status, polling can refresh status until approved or rejected.

## Long Polling

Long polling sends a request and the server holds it until new data is available.

```text
Client sends request
  |
  v
Server waits until update exists
  |
  v
Server responds
  |
  v
Client sends next request
```

Interview answer:

Long polling reduces unnecessary responses compared with short polling, but backend must support holding requests.

## Server-Sent Events

SSE lets the server push updates to the client over HTTP.

```jsx
useEffect(() => {
  const events = new EventSource("/api/onboarding/events")

  events.onmessage = (event) => {
    const update = JSON.parse(event.data)
    setStatus(update.status)
  }

  return () => events.close()
}, [])
```

Interview answer:

SSE is good when the server pushes one-way updates, such as onboarding status, notifications, or audit logs.

## WebSockets

WebSockets provide two-way real-time communication.

```jsx
useEffect(() => {
  const socket = new WebSocket("wss://example.com/live")

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message)
  }

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "subscribe" }))
  }

  return () => socket.close()
}, [])
```

Interview answer:

WebSockets are useful for chat, live dashboards, notifications, trading data, and admin review queues.

## Server State

Server state is data owned by the backend.

Examples:

- user profile
- transactions
- onboarding status
- document verification result
- dashboard metrics

Frontend should cache server state instead of manually storing every API response in local state.

## TanStack Query

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

TanStack Query is a strong default for server-state caching in React apps that do not already require Redux.

## Query Keys

Query keys identify cached data.

```jsx
useQuery({
  queryKey: ["products", page, search],
  queryFn: () => getProducts({ page, search }),
})
```

Mental model:

```text
["products", 1, "phone"]  -> cache for page 1 phone search
["products", 2, "phone"]  -> cache for page 2 phone search
["products", 1, "laptop"] -> different cache entry
```

Interview answer:

I include every variable used by the API call in the query key. This lets the library cache each result correctly.

## staleTime And gcTime

```jsx
useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
})
```

```text
staleTime
  |
  +-- how long data is considered fresh

gcTime
  |
  +-- how long unused cache stays in memory
```

Interview answer:

`staleTime` controls when data becomes stale and eligible for refetch. `gcTime` controls how long unused cached data stays before garbage collection.

## Prefetch Next Page

```jsx
import { useQueryClient } from "@tanstack/react-query"

function ProductsPage({ page }) {
  const queryClient = useQueryClient()

  function prefetchNextPage() {
    queryClient.prefetchQuery({
      queryKey: ["products", page + 1],
      queryFn: () => getProducts(page + 1),
    })
  }

  return <button onMouseEnter={prefetchNextPage}>Next</button>
}
```

Interview answer:

Prefetching loads likely-needed data before the user asks for it, making navigation feel faster.

## React Query Pagination

```jsx
function ProductsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts(page),
    staleTime: 60 * 1000,
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      {data.items.map((product) => (
        <p key={product.id}>{product.title}</p>
      ))}

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  )
}
```

Interview answer:

Each page gets its own query key, so when the user goes back to a previous page, cached data can be shown quickly.

## TanStack Query Step-By-Step Setup

```text
1. Create QueryClient
   |
   v
2. Wrap app with QueryClientProvider
   |
   v
3. Create API function
   |
   v
4. Use useQuery for GET requests
   |
   v
5. Use useMutation and invalidate queries after updates
```

### Step 1: Configure Provider

File: `src/main.jsx`

```jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

### Step 2: Create API Function

```jsx
async function getProducts() {
  const response = await fetch("/api/products")

  if (!response.ok) {
    throw new Error("Failed to load products")
  }

  return response.json()
}
```

### Step 3: Use Query In Component

```jsx
import { useQuery } from "@tanstack/react-query"

function ProductsPage() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load products</p>

  return data.map((product) => (
    <p key={product.id}>{product.title}</p>
  ))
}
```

Interview answer:

TanStack Query caches data by `queryKey`. If the user leaves and returns, it can show cached data instead of always refetching immediately, depending on `staleTime`.

## RTK Query

Best when the app already uses Redux Toolkit.

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

RTK Query handles server-state caching inside the Redux Toolkit ecosystem.

For full RTK Query wiring, see `React-state-management-interview.md`, where the API slice, store reducer, middleware, and generated hooks are explained step by step.

## Apollo Client

Best for GraphQL-heavy apps.

```jsx
import { ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery } from "@apollo/client"

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
```

Interview answer:

Apollo Client is a strong choice for GraphQL applications because it provides GraphQL queries, mutations, normalized cache, and integration with React.

## SWR

SWR means Stale While Revalidate.

```jsx
import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

function ProductsPage() {
  const { data, error, isLoading } = useSWR("/api/products", fetcher)

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong</p>

  return data.map((product) => <p key={product.id}>{product.name}</p>)
}
```

Cache key:

```text
"/api/products"
```

Flow:

```text
First visit -> fetch data -> store in cache
Return later -> show cached data -> revalidate in background
```

Interview answer:

SWR is lightweight and useful for simple data fetching with cache and background revalidation.

## Which API Tool Is Better?

```text
REST/general app -> TanStack Query
Redux app -> RTK Query
GraphQL-heavy app -> Apollo Client
Simple lightweight fetching -> SWR
```

Interview answer:

I would not add Redux only for API caching. For a new React app, TanStack Query is often a strong default. If the app already uses Redux Toolkit, RTK Query fits well. If the backend is GraphQL-heavy, Apollo Client is often the best choice.

## Resume-Based Examples

Stablehouse:

- GraphQL APIs for document upload and onboarding submission.
- POI/POA status can be handled as server state.
- Upload mutation should invalidate onboarding status.
- Polling/SSE can update verification status.

HNB Digital Lobby:

- REST APIs for dashboard and customer data.
- Axios interceptors can centralize auth headers and global errors.
- Query caching can avoid repeated dashboard requests.
