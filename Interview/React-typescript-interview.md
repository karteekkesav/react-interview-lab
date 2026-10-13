# React TypeScript Interview Notes

## TypeScript Core Interview Drill

### 1. type Vs interface

Both describe shapes and participate in TypeScript's structural type system.

```ts
interface User {
  id: string
  name: string
}

type UserRole = "admin" | "reviewer"

type UserWithRole = User & {
  role: UserRole
}
```

Use `interface` primarily for extendable object contracts, component props, and public library APIs. Use `type` for unions, primitives, tuples, mapped types, conditional types, and compositions.

Interfaces can extend other interfaces:

```ts
interface Person {
  name: string
}

interface Employee extends Person {
  employeeId: string
}
```

Interfaces with the same name merge when their members are compatible:

```ts
interface Client {
  id: string
}

interface Client {
  riskLevel: "low" | "high"
}

const client: Client = {
  id: "C101",
  riskLevel: "low",
}
```

Type aliases cannot be reopened. They compose with intersections:

```ts
type Audited = { createdAt: string }
type AuditedClient = Client & Audited
```

Mental model:

```text
interface -> open object contract; supports extends and merging
type      -> alias for any type expression; supports unions and advanced composition
```

Interview answer:

> I use interfaces for object contracts intended to be extended and types for unions, tuples, mapped types, and advanced composition. Both can model objects, so consistency matters. The important unique behavior is that interfaces support declaration merging while type aliases do not.

### 2. any Vs unknown Vs never Vs void

```text
any     -> opt out of type checking
unknown -> value exists, but its type must be proven before use
never   -> value can never occur
void    -> function does not return a useful value
```

`any` allows unsafe operations and spreads lost type safety:

```ts
function unsafe(value: any) {
  value.notARealMethod() // Compiles but may crash.
}
```

Use `unknown` at untrusted boundaries and narrow it:

```ts
function getMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error"
}
```

Use `void` for functions called for their side effects:

```ts
function logEvent(name: string): void {
  console.log(name)
}
```

Use `never` for impossible states or functions that cannot complete:

```ts
function fail(message: string): never {
  throw new Error(message)
}

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`)
}
```

Avoid `any` because it disables checks both on the value and on values derived from it. If the input is genuinely unknown, `unknown` preserves safety.

### 3. Generics

Generics express a relationship between types while keeping code reusable.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}

const firstClient = first<Client>(clients)
```

Generic React component:

```tsx
type TableProps<T> = {
  rows: T[]
  getKey: (row: T) => string
  renderRow: (row: T) => React.ReactNode
}

function Table<T>({ rows, getKey, renderRow }: TableProps<T>) {
  return <>{rows.map((row) => <div key={getKey(row)}>{renderRow(row)}</div>)}</>
}
```

Generic API client:

```ts
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json() as Promise<T>
}
```

Generic constraint:

```ts
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}
```

Generics do not validate runtime data. `getJson<User>()` states what the caller expects; validation is still required at an external boundary.

Interview answer:

> Generics preserve type relationships without duplicating implementations. I use them for reusable collections, React components, API envelopes, repository functions, and utility types, adding constraints when an operation requires specific properties.

### 4. Type Narrowing

Narrowing is TypeScript's control-flow analysis that reduces a broad type to a more specific type after runtime checks.

```ts
function format(value: string | number) {
  if (typeof value === "string") return value.trim()
  return value.toFixed(2)
}
```

Common narrowing tools:

```ts
// instanceof
if (error instanceof Error) console.log(error.message)

// in
if ("permissions" in user) console.log(user.permissions)

// equality / discriminant
if (response.status === "success") console.log(response.data)

// null check
if (client !== null) console.log(client.id)
```

`typeof` works well for primitives, `instanceof` for class instances, `in` for property presence, and equality checks for literal or discriminated unions.

### 5. Union Vs Intersection Types

```ts
type User = { id: string; name: string }
type Admin = { permissions: string[] }

type UserOrAdmin = User | Admin
type AdminUser = User & Admin
```

```text
User | Admin -> value may be either shape; narrow before using unique fields
User & Admin -> value must satisfy both shapes
```

Use unions for alternatives, states, variants, and API outcomes:

```ts
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: Client[] }
  | { status: "error"; message: string }
```

Use intersections to combine capabilities:

```ts
type TimestampedClient = Client & {
  createdAt: string
  updatedAt: string
}
```

### 6. Type Guards And API Results

A type guard performs a runtime check that TypeScript uses for narrowing. A custom guard returns a type predicate such as `value is Success<T>`.

```ts
type ApiSuccess<T> = {
  ok: true
  data: T
}

type ApiFailure = {
  ok: false
  error: { code: string; message: string }
}

type ApiResult<T> = ApiSuccess<T> | ApiFailure

function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok === true
}

function handleResult(result: ApiResult<Client>) {
  if (isApiSuccess(result)) {
    console.log(result.data.id)
  } else {
    console.error(result.error.message)
  }
}
```

For an entirely untrusted `unknown` response, the guard must validate the required runtime shape rather than merely assert it:

```ts
function isClient(value: unknown): value is Client {
  if (typeof value !== "object" || value === null) return false

  const candidate = value as Record<string, unknown>
  return typeof candidate.id === "string" && typeof candidate.name === "string"
}
```

For complex contracts, prefer a schema validator such as Zod, Valibot, or a generated OpenAPI validator instead of manually checking every nested field.

### 7. Utility Types

Given:

```ts
interface ClientProfile {
  id: string
  name: string
  email?: string
  riskLevel: "low" | "medium" | "high"
}
```

```ts
type ClientPatch = Partial<ClientProfile>
// All fields optional; useful for PATCH input.

type CompleteClient = Required<ClientProfile>
// All fields required after validation/defaulting.

type ClientListItem = Pick<ClientProfile, "id" | "name" | "riskLevel">
// Select only fields required by a list.

type CreateClientInput = Omit<ClientProfile, "id">
// Exclude server-generated fields.

type ClientsById = Record<string, ClientProfile>
// Dictionary keyed by client ID.

type ImmutableClient = Readonly<ClientProfile>
// Prevent property reassignment at compile time.

function createClient(input: CreateClientInput) {
  return { id: crypto.randomUUID(), ...input }
}

type CreatedClient = ReturnType<typeof createClient>
// Derive the function's return type.
```

Utility types transform existing types and reduce duplicate contracts. Do not use `Partial` when only specific fields are legally optional; model the exact update contract instead.

### 8. Typing Real-World API Responses

Separate domain entities, transport envelopes, pagination metadata, and errors:

```ts
type ApiError = {
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
  correlationId?: string
}

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

type Page<T> = {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  nextCursor?: string
}

type ClientDto = {
  id: string
  legalName: string
  status?: "pending" | "approved" | "rejected"
}

type ClientPageResponse = ApiResult<Page<ClientDto>>
```

Different response shapes should use discriminated unions:

```ts
type UploadResult =
  | { status: "accepted"; documentId: string }
  | { status: "rejected"; reasons: string[] }
  | { status: "processing"; jobId: string }
```

At the boundary:

```text
HTTP JSON (unknown)
  -> runtime schema validation
  -> map DTO to domain model
  -> application uses trusted typed data
```

Avoid making every field optional merely because an API is inconsistent. Fix or validate the contract and model genuine absence explicitly.

### 9. Compile-Time Types Vs Runtime Validation

TypeScript types are erased when JavaScript is produced. They prevent mistakes during development but do not inspect network responses at runtime.

```ts
const user = await response.json() as User
```

This assertion does not prove that `user` is valid. It only tells the compiler to trust the developer.

```ts
const raw: unknown = await response.json()

if (!isUser(raw)) {
  throw new Error("Invalid user response")
}

// raw is safely narrowed to User here.
```

Mental model:

```text
TypeScript -> compile-time developer safety
Validator  -> runtime boundary safety
```

Interview answer:

> If TypeScript says a response is `User`, that is not runtime proof. Network data begins as untrusted `unknown`; I validate it with a schema or type guard before treating it as a domain type.

### 10. Strongly Typed Large-Scale Architecture

Recommended layers:

```text
Generated or validated API contracts
               |
               v
Transport DTOs and API client
               |
               v
DTO-to-domain mapping
               |
               v
Feature services and state
               |
               v
Typed React components
```

Enable strict compiler checks:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true
  }
}
```

Large-scale guidelines:

- organize types by business domain, not one global `types.ts` file;
- distinguish API DTOs from domain and UI models;
- generate contracts from OpenAPI or GraphQL schemas when possible;
- validate external data at runtime;
- use discriminated unions for state and errors;
- keep generics purposeful and understandable;
- use `unknown` at unsafe boundaries and avoid `any`;
- share stable contracts through versioned packages in multi-application systems;
- add compile-time type checks to CI;
- use exhaustive `never` checks for important workflows;
- evolve frontend and backend contracts compatibly.

Exhaustive workflow handling:

```ts
type OnboardingStatus = "draft" | "submitted" | "approved" | "rejected"

function statusLabel(status: OnboardingStatus): string {
  switch (status) {
    case "draft": return "Draft"
    case "submitted": return "Submitted"
    case "approved": return "Approved"
    case "rejected": return "Rejected"
    default: return assertNever(status)
  }
}
```

Interview answer:

> I enable strict mode, organize contracts around domains, separate transport DTOs from domain models, generate API types where possible, and validate external data at runtime. I use generics for reusable relationships, discriminated unions for states and errors, `unknown` at boundaries, and exhaustive checks for workflows. CI runs type checking so frontend and backend contract drift is detected early.

## TypeScript Core Rapid Revision

```text
interface -> extendable object contract and declaration merging
type      -> unions, tuples, mapped and conditional composition
unknown   -> safe untrusted value; narrow before use
never     -> impossible state or non-returning function
generic   -> reusable relationship between types
union     -> one of several alternatives
intersection -> must satisfy all combined types
type guard -> runtime condition that narrows a type
utility type -> transformation of an existing type
runtime validator -> proves external data shape while the app runs
```


Purpose: quick interview revision for using TypeScript with React in real projects.

## Visual Mental Model

```text
API data + user actions
        |
        v
TypeScript types
        |
        v
Typed components, hooks, forms, and API calls
        |
        v
Fewer runtime bugs + better autocomplete + safer refactoring
```

Interview answer:

TypeScript helps catch mistakes before runtime. In React, it is especially useful for props, API responses, form data, reusable components, event handlers, and custom hooks.

## Why TypeScript With React?

Use TypeScript when the application has many components, API contracts, shared data models, and multiple developers.

Benefits:

- Catches wrong prop names and wrong data types early.
- Makes API response handling safer.
- Improves autocomplete and refactoring.
- Documents component contracts clearly.
- Reduces bugs in enterprise applications.

Resume-style example:

In an onboarding or document verification flow, TypeScript helps define exactly what a customer profile, POI document, POA document, verification status, and API response should look like.

## Typing Props

```tsx
type UserCardProps = {
  name: string
  role: string
  isActive: boolean
}

function UserCard({ name, role, isActive }: UserCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
      <p>{isActive ? "Active" : "Inactive"}</p>
    </div>
  )
}

export default function App() {
  return <UserCard name="Karteek" role="Frontend Developer" isActive={true} />
}
```

Interview answer:

Props typing defines the contract between parent and child components. If a parent passes a wrong value, TypeScript warns before the app runs.

## Optional Props

```tsx
type AlertProps = {
  message: string
  type?: "success" | "error" | "info"
}

function Alert({ message, type = "info" }: AlertProps) {
  return <p className={`alert ${type}`}>{message}</p>
}
```

Here `type` is optional. If the parent does not pass it, the component uses `"info"`.

## Interface vs Type

Both can type props and objects.

```tsx
interface User {
  id: number
  name: string
}

type ApiStatus = "idle" | "loading" | "success" | "error"
```

Object example with `interface`:

```tsx
interface User {
  id: number
  name: string
}

interface Admin extends User {
  role: "admin"
}

const admin: Admin = {
  id: 1,
  name: "Karteek",
  role: "admin",
}
```

Object example with `type`:

```tsx
type User = {
  id: number
  name: string
}

type Admin = User & {
  role: "admin"
}
```

Key difference:

- `interface` is mainly for object shapes.
- `interface` can be extended using `extends`.
- `interface` supports declaration merging.
- `type` can create unions like `"loading" | "success" | "error"`.
- `type` can create tuples, primitive aliases, function types, and flexible combinations.

Declaration merging example:

```tsx
interface User {
  id: number
}

interface User {
  name: string
}

const user: User = {
  id: 1,
  name: "Karteek",
}
```

Type aliases cannot be declared twice with the same name:

```tsx
type User = {
  id: number
}

// Error: Duplicate identifier 'User'
type User = {
  name: string
}
```

React props can use either:

```tsx
interface ButtonProps {
  label: string
  onClick: () => void
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

The same props using `type`:

```tsx
type ButtonProps = {
  label: string
  onClick: () => void
}
```

Simple interview rule:

- Use `interface` for object shapes that may be extended.
- Use `type` for unions, function types, utility types, and flexible combinations.

Both are accepted in React projects. Consistency inside the codebase matters more than personal preference.

Interview answer:

Both `interface` and `type` can define object shapes. I use `interface` when I want an extendable object contract, and I use `type` when I need unions, tuples, function types, primitive aliases, or utility-type combinations. In React projects, both are valid, so consistency with the existing codebase is usually more important than personal preference.

## Tuples

A tuple is a fixed-length array where each position has a specific type.

Normal array:

```tsx
const numbers: number[] = [10, 20, 30, 40]
```

This means the array can have any number of items, but every item should be a number.

Tuple:

```tsx
const user: [number, string] = [1, "Karteek"]
```

This means:

- First value must be a `number`.
- Second value must be a `string`.
- Order matters.
- Length is fixed.

Invalid examples:

```tsx
const user1: [number, string] = ["Karteek", 1] // wrong order
const user2: [number, string] = [1] // missing value
const user3: [number, string] = [1, "Karteek", true] // extra value
```

Tuple with labels:

```tsx
type UserInfo = [id: number, name: string, isAdmin: boolean]

const user: UserInfo = [1, "Karteek", true]
```

Labels make the tuple easier to understand, but the values are still accessed by position.

```tsx
user[0] // id
user[1] // name
user[2] // isAdmin
```

React-style example:

```tsx
type StateTuple = [string, (value: string) => void]

const state: StateTuple = [
  "hello",
  (value) => console.log(value),
]
```

This is similar to what React `useState` returns:

```tsx
const [name, setName] = useState("Karteek")
```

Conceptually, React returns a tuple:

```tsx
[name, setName]
```

The first value is the current state. The second value is the function used to update that state.

Another common example:

```tsx
type Point = [number, number]

const location: Point = [10, 20]

location[0] // x coordinate
location[1] // y coordinate
```

Use tuple when position has meaning:

```tsx
type ApiResult = [success: boolean, message: string]

const result: ApiResult = [true, "Data loaded"]
```

Use an object when property names make the data clearer:

```tsx
const result = {
  success: true,
  message: "Data loaded",
}
```

Interview answer:

A tuple is a fixed-length array where each position has a specific type. Unlike normal arrays, tuples care about the order and type of each element. They are useful when returning multiple values, like React `useState`, which returns `[state, setState]`.

Quick rule:

- Tuple means fixed positions.
- Object means named properties.

## Typing useState

```tsx
import { useState } from "react"

type User = {
  id: number
  name: string
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null)

  function loadUser() {
    setUser({ id: 1, name: "Karteek" })
  }

  return (
    <div>
      <button onClick={loadUser}>Load User</button>
      {user && <p>{user.name}</p>}
    </div>
  )
}
```

Interview answer:

When state starts as `null`, we should tell TypeScript what the real data will look like later. That is why we use `User | null`.

## Typing Events

```tsx
import { useState } from "react"

function SearchBox() {
  const [search, setSearch] = useState("")

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  return <input value={search} onChange={handleChange} />
}
```

Interview answer:

React events are synthetic events. TypeScript helps us know which properties are available on the event target. For input changes, `React.ChangeEvent<HTMLInputElement>` is commonly used.

## Typing Form Submit

```tsx
function LoginForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("Submit login form")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <button type="submit">Login</button>
    </form>
  )
}
```

## API Response Typing

```tsx
type Product = {
  id: number
  title: string
  price: number
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products")

  if (!response.ok) {
    throw new Error("Failed to load products")
  }

  return response.json()
}
```

Interview answer:

Typing API responses makes the frontend safer. If the UI expects `title` and `price`, TypeScript can warn us if we accidentally use a wrong property.

## Discriminated Union For API State

```tsx
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string }

function ProductList({ state }: { state: RequestState }) {
  if (state.status === "idle") return <p>Start search</p>
  if (state.status === "loading") return <p>Loading...</p>
  if (state.status === "error") return <p role="alert">{state.error}</p>

  return (
    <ul>
      {state.data.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
```

Visual model:

```text
idle -> loading -> success
              \-> error
```

Interview answer:

Discriminated unions are useful when the UI has different states. They prevent us from trying to access `data` when the request failed.

## Typing Children

```tsx
import { ReactNode } from "react"

type CardProps = {
  title: string
  children: ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
```

`ReactNode` supports text, JSX, arrays, `null`, and other renderable React values.

## Generics

Generics help create reusable functions, types, hooks, and components without losing type safety.

Simple meaning:

```tsx
function identity<T>(value: T): T {
  return value
}

const name = identity<string>("Karteek")
const age = identity<number>(25)
```

Here `T` is a type variable. It means the function can work with different types, but TypeScript still remembers the exact type.

Most of the time, TypeScript can infer the type automatically:

```tsx
const name = identity("Karteek") // string
const age = identity(25) // number
```

Without generics, we may lose type safety:

```tsx
function identity(value: any): any {
  return value
}

const result = identity("Karteek")
result.toFixed(2) // TypeScript will not warn, but this is wrong at runtime
```

With generics:

```tsx
function identity<T>(value: T): T {
  return value
}

const result = identity("Karteek")
result.toFixed(2) // Error: string does not have toFixed
```

Generic array example:

```tsx
function getFirstItem<T>(items: T[]): T {
  return items[0]
}

const firstName = getFirstItem(["Karteek", "Alex"]) // string
const firstNumber = getFirstItem([10, 20, 30]) // number
```

The same function works for different arrays, but the return type remains accurate.

Generic API response type:

```tsx
type ApiResponse<T> = {
  data: T
  success: boolean
  message: string
}

type User = {
  id: number
  name: string
}

type Product = {
  id: number
  title: string
  price: number
}

const userResponse: ApiResponse<User> = {
  data: {
    id: 1,
    name: "Karteek",
  },
  success: true,
  message: "User loaded",
}

const productResponse: ApiResponse<Product[]> = {
  data: [
    {
      id: 1,
      title: "Laptop",
      price: 50000,
    },
  ],
  success: true,
  message: "Products loaded",
}
```

Here `ApiResponse<T>` is reusable. The outer response shape is the same, but `data` can change based on the API.

Generic fetch helper:

```tsx
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }

  return response.json()
}

type User = {
  id: number
  name: string
}

const user = await fetchData<User>("/api/user/1")
```

Now TypeScript knows `user.id` and `user.name` are available.

Generic React component:

```tsx
type SelectProps<T> = {
  items: T[]
  getLabel: (item: T) => string
  onSelect: (item: T) => void
}

function Select<T>({ items, getLabel, onSelect }: SelectProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <button onClick={() => onSelect(item)}>{getLabel(item)}</button>
        </li>
      ))}
    </ul>
  )
}
```

Usage with users:

```tsx
type User = {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: "Karteek" },
  { id: 2, name: "Alex" },
]

<Select
  items={users}
  getLabel={(user) => user.name}
  onSelect={(user) => console.log(user.id)}
/>
```

Usage with products:

```tsx
type Product = {
  id: number
  title: string
  price: number
}

const products: Product[] = [
  { id: 1, title: "Laptop", price: 50000 },
  { id: 2, title: "Phone", price: 30000 },
]

<Select
  items={products}
  getLabel={(product) => product.title}
  onSelect={(product) => console.log(product.price)}
/>
```

The same `Select` component works for users and products. TypeScript understands the correct item type in each usage.

Generic with constraint:

```tsx
function getItemId<T extends { id: number }>(item: T): number {
  return item.id
}

getItemId({ id: 1, name: "Karteek" }) // valid
getItemId({ name: "Karteek" }) // Error: id is missing
```

`extends` is used here to say: `T` can be any object type, but it must have an `id` property.

Generic table example:

```tsx
type Column<T> = {
  header: string
  render: (item: T) => React.ReactNode
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
}

function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.header}>{column.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Usage:

```tsx
type User = {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: "Karteek", email: "karteek@example.com" },
]

<Table
  data={users}
  columns={[
    { header: "Name", render: (user) => user.name },
    { header: "Email", render: (user) => user.email },
  ]}
/>
```

The table does not need to know the exact shape of `User`, but each column still gets proper autocomplete and type safety.

Generic custom hook:

```tsx
import { useEffect, useState } from "react"

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    fetch(url)
      .then((response) => response.json())
      .then((result: T) => setData(result))
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}
```

Usage:

```tsx
type User = {
  id: number
  name: string
}

function UserProfile() {
  const { data: user, loading } = useFetch<User>("/api/user/1")

  if (loading) return <p>Loading...</p>

  return <p>{user?.name}</p>
}
```

This hook can fetch any data shape, but the component still gets correct typing.

Interview answer:

Generics allow us to write reusable code while preserving type safety. Instead of using `any`, we use a type variable like `T`, so the same function, hook, or component can work with different data shapes. In React, generics are useful for reusable components like dropdowns, tables, autocomplete components, API helpers, and custom hooks.

Common interview examples:

- `Array<T>` means an array of a specific item type.
- `Promise<T>` means a promise that resolves with a specific type.
- `ApiResponse<T>` means a reusable API response where the `data` type can change.
- `Select<T>` means a reusable select component where the item type can change.
- `useFetch<T>` means a reusable hook that can return different response shapes.

Quick rule:

- Use generics when the logic is reusable but the data type changes.
- Avoid `any` when a generic can preserve the actual type.
- Use constraints like `T extends { id: number }` when the generic type must have certain properties.

## Utility Types

Utility types are built-in TypeScript helpers that transform existing types. They help us avoid duplicate type definitions.

Interview answer:

Utility types help us reuse and transform existing types instead of rewriting new ones. In React projects, I commonly use `Partial` for update forms, `Pick` for component props, `Omit` for removing sensitive fields, `Record` for maps/config, and `ReturnType` or `Awaited` for API response typing.

### Base Type

```tsx
type User = {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "guest"
  password: string
}
```

### `Partial<T>`

`Partial<T>` makes all properties optional.

```tsx
type UpdateUserPayload = Partial<User>

const userUpdate: UpdateUserPayload = {
  name: "Karteek",
}
```

Use case:

Useful for update forms where we may send only changed fields.

### `Required<T>`

`Required<T>` makes all optional properties required.

```tsx
type UserForm = {
  name?: string
  email?: string
}

type RequiredUserForm = Required<UserForm>

const form: RequiredUserForm = {
  name: "Karteek",
  email: "karteek@example.com",
}
```

Use case:

Useful after validation, when all fields must be present.

### `Pick<T, Keys>`

`Pick<T, Keys>` selects only specific properties.

```tsx
type UserPreview = Pick<User, "id" | "name">

const preview: UserPreview = {
  id: 1,
  name: "Karteek",
}
```

Use case:

Useful when a component needs only a few fields from a larger object.

### `Omit<T, Keys>`

`Omit<T, Keys>` removes specific properties.

```tsx
type PublicUser = Omit<User, "password">

const user: PublicUser = {
  id: 1,
  name: "Karteek",
  email: "karteek@example.com",
  role: "admin",
}
```

Use case:

Useful when hiding sensitive fields like password, token, or internal IDs.

### `Readonly<T>`

`Readonly<T>` makes all properties read-only.

```tsx
type ReadonlyUser = Readonly<User>

const user: ReadonlyUser = {
  id: 1,
  name: "Karteek",
  email: "karteek@example.com",
  role: "user",
  password: "secret",
}

user.name = "Rahul"
// Error: cannot assign to name because it is read-only
```

Use case:

Useful when data should not be modified directly.

### `Record<Key, Value>`

`Record<Key, Value>` creates an object type with fixed keys and a specific value type.

```tsx
type Role = "admin" | "user" | "guest"

const permissions: Record<Role, string[]> = {
  admin: ["create", "read", "update", "delete"],
  user: ["read", "update"],
  guest: ["read"],
}
```

Use case:

Useful for mapping roles, statuses, themes, routes, or configuration values.

### `Exclude<T, U>`

`Exclude<T, U>` removes types from a union.

```tsx
type Status = "pending" | "success" | "failed" | "cancelled"

type ActiveStatus = Exclude<Status, "cancelled">

const status: ActiveStatus = "success"
```

This is not allowed:

```tsx
const status: ActiveStatus = "cancelled"
// Error
```

Use case:

Useful when we want all union values except a few.

### `Extract<T, U>`

`Extract<T, U>` keeps only matching types from a union.

```tsx
type Status = "pending" | "success" | "failed"

type ErrorStatus = Extract<Status, "failed" | "cancelled">

const status: ErrorStatus = "failed"
```

Use case:

Useful when filtering allowed values from a union.

### `NonNullable<T>`

`NonNullable<T>` removes `null` and `undefined`.

```tsx
type UserName = string | null | undefined

type ValidUserName = NonNullable<UserName>

const name: ValidUserName = "Karteek"
```

This is not allowed:

```tsx
const name: ValidUserName = null
// Error
```

Use case:

Useful after validation when a value must definitely exist.

### `ReturnType<T>`

`ReturnType<T>` gets the return type of a function.

```tsx
function getUser() {
  return {
    id: 1,
    name: "Karteek",
  }
}

type UserFromFunction = ReturnType<typeof getUser>
```

Now `UserFromFunction` becomes:

```tsx
type UserFromFunction = {
  id: number
  name: string
}
```

Use case:

Useful when we want to reuse the return type of a function without manually writing it.

### `Parameters<T>`

`Parameters<T>` gets function parameter types as a tuple.

```tsx
function createUser(name: string, age: number) {
  return {
    name,
    age,
  }
}

type CreateUserParams = Parameters<typeof createUser>
```

Now `CreateUserParams` becomes:

```tsx
type CreateUserParams = [string, number]
```

Use case:

Useful when reusing function argument types.

### `Awaited<T>`

`Awaited<T>` gets the resolved type of a Promise.

```tsx
async function fetchUser() {
  return {
    id: 1,
    name: "Karteek",
  }
}

type ApiUser = Awaited<ReturnType<typeof fetchUser>>
```

Now `ApiUser` becomes:

```tsx
type ApiUser = {
  id: number
  name: string
}
```

Use case:

Very useful for API functions because API calls usually return promises.

Quick interview summary:

```text
Partial       -> make fields optional
Required      -> make fields required
Pick          -> select fields
Omit          -> remove fields
Readonly      -> prevent direct mutation
Record        -> create object maps
Exclude       -> remove union members
Extract       -> keep union members
NonNullable   -> remove null and undefined
ReturnType    -> get function return type
Parameters    -> get function arguments as tuple
Awaited       -> get resolved Promise type
```

## Typing Custom Hooks

```tsx
import { useEffect, useState } from "react"

type User = {
  id: number
  name: string
}

function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    fetch("/api/users")
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .finally(() => setLoading(false))
  }, [])

  return { users, loading }
}
```

Interview answer:

A typed custom hook hides reusable logic and exposes a predictable return shape to components.

## TypeScript With Forms

```tsx
import { useState } from "react"

type LoginFormData = {
  email: string
  password: string
}

function LoginForm() {
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <form>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} />
    </form>
  )
}
```

## Resume-Based Interview Examples

Stablehouse-style answer:

In the onboarding flow, I would type GraphQL responses for customer status, POI document upload, POA document upload, and verification results. This prevents UI bugs where the component expects a status like `"approved"` but receives a different shape.

HNB-style answer:

In a banking dashboard, I would type transaction rows, account summaries, filters, and reusable table props. This makes shared components safer across multiple modules.

## Common Interview Questions

### Why TypeScript in React?

To catch prop, state, event, and API contract errors before runtime.

### Does TypeScript improve runtime performance?

No. TypeScript is removed during build. It improves developer safety, maintainability, and refactoring confidence.

### Should every component be typed?

Yes, especially shared components, page components, API data, forms, and custom hooks.

### What is the biggest benefit in enterprise React apps?

Stable contracts between components, APIs, and teams.

## Quick Summary

- Type props clearly.
- Type API responses.
- Use unions for UI request states.
- Use generics for reusable components.
- Use utility types to avoid duplicate model definitions.
- TypeScript is mainly about maintainability and safety, not runtime speed.
