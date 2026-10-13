# React 19 Features Interview Notes

Purpose: quick interview revision for React 19 features with simple examples, visual diagrams, and practical explanations.

Official references:

- React 19 release notes: https://react.dev/blog/2024/12/05/react-19
- `useActionState`: https://react.dev/reference/react/useActionState
- `useOptimistic`: https://react.dev/reference/react/useOptimistic
- `useFormStatus`: https://react.dev/reference/react-dom/hooks/useFormStatus
- `use`: https://react.dev/reference/react/use

## React 19 Mental Model

React 19 focuses heavily on async UI, forms, optimistic updates, server integration, and developer experience.

```text
React 19
  |
  +-- Actions
  +-- useActionState
  +-- form actions
  +-- useFormStatus
  +-- useOptimistic
  +-- use()
  +-- Server Components support
  +-- Server Actions support in frameworks
  +-- ref as prop
  +-- document metadata support
  +-- resource preloading APIs
  +-- better hydration and error reporting
  +-- custom elements support
```

Interview answer:

React 19 improves the way React handles async workflows. It reduces manual loading/error/pending state boilerplate, improves forms, supports optimistic UI, improves server/client integration, and adds smaller quality-of-life improvements like `ref` as a prop and better document metadata handling.

## 1. Actions

Actions are async functions used to perform updates, usually after user actions like form submit or button click.

Before React 19, we often wrote this manually:

```jsx
function UpdateName() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit() {
    try {
      setIsPending(true)
      setError("")
      await updateName(name)
    } catch {
      setError("Unable to update name")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button disabled={isPending} onClick={handleSubmit}>
        {isPending ? "Updating..." : "Update"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
```

Problem:

```text
manual pending state
manual error state
manual form handling
manual optimistic UI
manual reset logic
```

React 19 Actions help organize these async flows.

```text
User action
  |
  v
Action starts
  |
  +-- pending state
  +-- async request
  +-- error handling
  +-- optimistic update support
  |
  v
UI updates
```

Interview answer:

Actions are async operations that React can track. They are useful for form submissions and data mutations because React can coordinate pending state, errors, optimistic UI, and form behavior.

## 2. useActionState

`useActionState` manages state returned from an Action.

Basic structure:

```jsx
const [state, formAction, isPending] = useActionState(actionFunction, initialState)
```

Meaning:

```text
state
  |
  +-- latest value returned from the action

formAction
  |
  +-- wrapped action function
  +-- pass it to form action or call it from an event

isPending
  |
  +-- true while action is running
```

Example:

```jsx
import { useActionState } from "react"

async function updateName(previousState, formData) {
  const name = formData.get("name")

  if (!name) {
    return "Name is required"
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return ""
}

function ProfileForm() {
  const [error, submitAction, isPending] = useActionState(updateName, "")

  return (
    <form action={submitAction}>
      <label>
        Name
        <input name="name" />
      </label>

      <button disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  )
}
```

Step-by-step:

```text
User submits form
  |
  v
submitAction runs
  |
  v
updateName(previousState, formData)
  |
  v
isPending becomes true
  |
  v
Action returns error or success value
  |
  v
state updates with returned value
  |
  v
isPending becomes false
```

Interview answer:

`useActionState` is useful when the result of an async action should update component state. It is especially useful for forms because it can store validation errors or success messages and expose pending state without manually creating separate `loading` state.

## 3. Form Actions

In React 19, forms can receive a function in the `action` prop.

```jsx
async function saveUser(formData) {
  const name = formData.get("name")
  const email = formData.get("email")

  await createUser({ name, email })
}

function UserForm() {
  return (
    <form action={saveUser}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit">Save</button>
    </form>
  )
}
```

Important:

```text
input name="name"
  |
  v
formData.get("name")
```

The `name` attribute is important because `FormData` reads values by field name.

Flow:

```text
User submits form
  |
  v
React creates FormData
  |
  v
saveUser(formData)
  |
  v
API call / mutation
```

Interview answer:

Form Actions simplify form submit handling. Instead of writing `onSubmit`, `preventDefault`, and manual loading state every time, we can pass an action function to the form.

## 4. useFormStatus

`useFormStatus` reads the current status of a parent form.

It is imported from `react-dom`.

```jsx
import { useFormStatus } from "react-dom"
```

Example:

```jsx
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  )
}

async function saveUser(formData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

function UserForm() {
  return (
    <form action={saveUser}>
      <input name="name" />
      <SubmitButton />
    </form>
  )
}
```

Visual rule:

```text
<form>
  |
  +-- <SubmitButton />
        |
        +-- useFormStatus() can read parent form status
```

Common mistake:

```jsx
function WrongForm() {
  const { pending } = useFormStatus()

  return (
    <form action={saveUser}>
      <button disabled={pending}>Submit</button>
    </form>
  )
}
```

Why wrong?

```text
useFormStatus reads parent form status.
Here the hook is inside the same component that renders the form.
So pending may not work as expected.
```

Correct pattern:

```text
Parent form component
  |
  v
Child submit button component calls useFormStatus
```

Interview answer:

`useFormStatus` is useful for reusable submit buttons in design systems. It avoids prop drilling pending state into the button. The component using `useFormStatus` must be rendered inside the form.

## 5. useOptimistic

`useOptimistic` lets the UI update immediately before the server confirms the update.

Example: Like button.

```jsx
import { startTransition, useOptimistic, useState } from "react"

async function saveLike() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

function LikeButton() {
  const [likes, setLikes] = useState(10)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes) => currentLikes + 1,
  )

  function handleLike() {
    startTransition(async () => {
      addOptimisticLike()
      await saveLike()
      setLikes((currentLikes) => currentLikes + 1)
    })
  }

  return (
    <button onClick={handleLike}>
      Likes: {optimisticLikes}
    </button>
  )
}
```

Flow:

```text
Current likes: 10
  |
  v
User clicks Like
  |
  v
UI immediately shows 11
  |
  v
API request runs
  |
  v
Server confirms
  |
  v
Real state becomes 11
```

Why useful:

```text
Without optimistic UI
  |
  +-- user waits for server

With optimistic UI
  |
  +-- user sees instant feedback
```

Real project example:

```text
User uploads POI document
  |
  v
UI immediately shows "Uploading..."
  |
  v
Server confirms document received
  |
  v
UI shows "Uploaded" or refetches status
```

Interview answer:

`useOptimistic` is useful when we want fast user feedback while the server request is still pending. It is common for likes, comments, todo additions, document upload status, and chat messages.

## 6. use API

React 19 introduces `use()` for reading a Promise or Context during render.

Example with Promise:

```jsx
import { Suspense, use } from "react"

function Users({ usersPromise }) {
  const users = use(usersPromise)

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

function UsersPage({ usersPromise }) {
  return (
    <Suspense fallback={<p>Loading users...</p>}>
      <Users usersPromise={usersPromise} />
    </Suspense>
  )
}
```

Flow:

```text
Users component renders
  |
  v
use(usersPromise)
  |
  +-- promise pending -> Suspense fallback
  +-- promise resolved -> render users
```

Important:

```text
Do not create a new uncached promise directly during render.
Use promises from a Suspense-enabled framework or cached data layer.
```

Example with Context:

```jsx
import { createContext, use } from "react"

const ThemeContext = createContext("light")

function Heading({ children }) {
  if (!children) {
    return null
  }

  const theme = use(ThemeContext)

  return <h1 className={theme}>{children}</h1>
}
```

Difference from hooks:

```text
useContext
  |
  +-- must follow normal hook rules
  +-- cannot be called conditionally

use(Context)
  |
  +-- can be called conditionally during render
```

Interview answer:

`use()` can read promises and context during render. It works with Suspense and modern framework patterns. I would use it carefully, usually with framework-supported cached promises, not random promises created during render.

## 7. React Server Components

React Server Components allow some components to render on the server and avoid sending their JavaScript to the browser.

```text
Server Component
  |
  +-- can fetch data on server
  +-- no client JS for that component
  +-- cannot use browser-only APIs
  +-- cannot use useState or event handlers

Client Component
  |
  +-- can use state
  +-- can use effects
  +-- can handle clicks/input
  +-- ships JS to browser
```

Example mental model:

```jsx
// Server Component
async function ProductsPage() {
  const products = await getProducts()

  return <ProductList products={products} />
}
```

```jsx
// Client Component
"use client"

function AddToCartButton() {
  const [added, setAdded] = useState(false)

  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added" : "Add to cart"}
    </button>
  )
}
```

Interview answer:

Server Components reduce client-side JavaScript and allow server-side data fetching. Client Components are still needed for interactivity like clicks, input state, effects, and browser APIs.

## 8. Server Actions

Server Actions allow client interactions to call async functions that run on the server in supported frameworks.

Concept:

```text
Client button/form
  |
  v
calls server action reference
  |
  v
framework sends request to server
  |
  v
server function runs
  |
  v
result returns to client
```

Example concept:

```jsx
// server action
"use server"

export async function saveProfile(formData) {
  const name = formData.get("name")
  await db.user.update({ name })
}
```

```jsx
// client or server-rendered form in supported framework
function ProfileForm() {
  return (
    <form action={saveProfile}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

Important:

```text
"use server"
  |
  +-- marks a server action

There is no "use server" directive for Server Components.
Server Components are server by default in supported frameworks.
```

Interview answer:

Server Actions are useful for form submissions and mutations in frameworks that support React server features. They let the client trigger server-side logic without manually creating a separate API route for every action.

## 9. ref As A Prop

Before React 19, function components commonly needed `forwardRef`.

Before:

```jsx
import { forwardRef } from "react"

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />
})
```

React 19:

```jsx
function MyInput({ ref, ...props }) {
  return <input {...props} ref={ref} />
}

function Form() {
  const inputRef = useRef(null)

  return <MyInput ref={inputRef} placeholder="Name" />
}
```

Interview answer:

React 19 makes refs easier by allowing function components to receive `ref` as a normal prop. This reduces the need for `forwardRef` in new function components.

## 10. Context As Provider

React 19 allows rendering the context object directly as a provider.

Before:

```jsx
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>
```

React 19:

```jsx
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

Interview answer:

This is a smaller syntax improvement. It makes Context provider usage shorter and more consistent.

## 11. Cleanup Functions For Ref Callbacks

React 19 supports returning a cleanup function from ref callbacks.

```jsx
function MeasureBox() {
  return (
    <div
      ref={(node) => {
        if (!node) return

        console.log("Node mounted:", node)

        return () => {
          console.log("Node cleanup")
        }
      }}
    >
      Box
    </div>
  )
}
```

Flow:

```text
element mounts
  |
  v
ref callback receives node
  |
  v
return cleanup function
  |
  v
element unmounts
  |
  v
cleanup function runs
```

Interview answer:

Ref cleanup functions are useful when setup and cleanup are tied directly to a DOM node, such as measuring, observing, or integrating with third-party DOM libraries.

## 12. useDeferredValue Initial Value

React 19 adds an initial value option for `useDeferredValue`.

```jsx
const deferredSearch = useDeferredValue(search, "")
```

Meaning:

```text
Initial render
  |
  +-- deferredSearch = ""

Background render
  |
  +-- deferredSearch updates to real search value
```

Example:

```jsx
function SearchResults({ search }) {
  const deferredSearch = useDeferredValue(search, "")

  return <Results query={deferredSearch} />
}
```

Interview answer:

The initial value option lets us control what deferred value should be used on first render. It is useful when expensive UI should start from a lightweight fallback value.

## 13. Document Metadata Support

React 19 supports rendering metadata tags like `title`, `meta`, and `link` inside components.

```jsx
function ProductPage({ product }) {
  return (
    <article>
      <title>{product.name}</title>
      <meta name="description" content={product.description} />

      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </article>
  )
}
```

Mental model:

```text
Component renders metadata
  |
  v
React sees title/meta/link
  |
  v
React hoists metadata to document head
```

Interview answer:

React 19 improves metadata support so route/page components can define their own title and meta tags more naturally. Frameworks may still provide more advanced metadata APIs.

## 14. Stylesheet Support

React 19 improves support for stylesheets rendered by components.

```jsx
function ProductCard() {
  return (
    <section>
      <link rel="stylesheet" href="/product-card.css" precedence="default" />
      <h2>Product</h2>
    </section>
  )
}
```

Why helpful:

```text
component depends on stylesheet
  |
  v
React can manage ordering/loading
  |
  v
content is revealed after required styles are ready
```

Interview answer:

React 19 can better coordinate stylesheets with rendering, Suspense, SSR, and streaming. This helps avoid unstyled content and duplicate stylesheet insertion.

## 15. Async Script Support

React 19 supports async scripts rendered inside components and deduplicates them.

```jsx
function AnalyticsScript() {
  return <script async src="https://example.com/analytics.js" />
}
```

If the same component renders multiple times:

```text
<AnalyticsScript />
<AnalyticsScript />
```

React can avoid adding duplicate script tags.

Interview answer:

This helps component-level script loading, especially for third-party scripts like analytics, maps, or payment SDKs.

## 16. Resource Preloading APIs

React 19 includes APIs for resource hints.

```jsx
import { preconnect, prefetchDNS, preinit, preload } from "react-dom"

function ProductPage() {
  preconnect("https://cdn.example.com")
  prefetchDNS("https://analytics.example.com")
  preload("/fonts/app.woff2", { as: "font" })
  preinit("/scripts/payment.js", { as: "script" })

  return <h1>Product</h1>
}
```

Meaning:

```text
prefetchDNS
  |
  +-- resolve DNS early

preconnect
  |
  +-- open connection early

preload
  |
  +-- download resource early

preinit
  |
  +-- load and initialize resource early
```

Interview answer:

Resource preloading APIs help improve performance by telling the browser about important resources earlier, such as fonts, scripts, stylesheets, or connections needed for upcoming screens.

## 17. Better Hydration Error Messages

Hydration happens when React attaches interactivity to server-rendered HTML.

Problem:

```text
Server rendered: "Server"
Client rendered: "Client"
  |
  v
hydration mismatch
```

React 19 improves hydration error reporting by showing clearer mismatch information.

Common causes:

```text
Date.now() during render
Math.random() during render
different locale formatting
invalid HTML nesting
browser-only checks during server render
```

Interview answer:

Better hydration errors help debug SSR issues faster. In interviews, I would mention that hydration mismatches happen when server HTML and client render output do not match.

## 18. Better Error Reporting

React 19 improves error reporting for caught, uncaught, and recoverable errors.

Root options:

```jsx
createRoot(document.getElementById("root"), {
  onCaughtError(error, errorInfo) {
    console.log("Caught by Error Boundary:", error)
  },
  onUncaughtError(error, errorInfo) {
    console.log("Uncaught error:", error)
  },
  onRecoverableError(error, errorInfo) {
    console.log("Recoverable error:", error)
  },
}).render(<App />)
```

Interview answer:

React 19 gives better hooks for production error reporting. These options can be connected to tools like Sentry, Datadog, or New Relic.

## 19. Custom Elements Support

React 19 improves support for Web Components/custom elements.

Example:

```jsx
function PaymentWidget() {
  return (
    <payment-widget
      amount="100"
      currency="USD"
    />
  )
}
```

Interview answer:

Custom element support is useful when integrating web components from design systems, payment providers, or third-party UI libraries.

## 20. React DOM Static APIs

React 19 added static rendering APIs for static site generation.

Concept:

```text
React tree
  |
  v
wait for data
  |
  v
generate static HTML
  |
  v
serve as static response
```

Example concept:

```jsx
import { prerender } from "react-dom/static"

async function handler() {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ["/main.js"],
  })

  return new Response(prelude, {
    headers: { "content-type": "text/html" },
  })
}
```

Interview answer:

React DOM static APIs are mainly useful for frameworks and custom static rendering setups. They improve static HTML generation by waiting for data before returning the static output.

## React 19 Interview Comparison

```text
React 18
  |
  +-- concurrent rendering foundation
  +-- automatic batching
  +-- useTransition
  +-- useDeferredValue

React 19
  |
  +-- async Actions
  +-- form Actions
  +-- useActionState
  +-- useFormStatus
  +-- useOptimistic
  +-- use()
  +-- Server Components support
  +-- server action integration in frameworks
  +-- better metadata/assets/error handling
```

## Best Interview Answer

React 19 focuses on making async UI and forms easier. The most important interview topics are Actions, `useActionState`, form Actions, `useFormStatus`, `useOptimistic`, and `use()`. These features reduce manual loading/error state handling, improve form submissions, support optimistic UI, and work well with modern frameworks. React 19 also includes improvements like `ref` as a prop, Context provider shorthand, document metadata support, resource preloading APIs, better hydration errors, and improved Server Components integration.

## Must-Revise Checklist

- What are Actions?
- What is `useActionState`?
- How do form Actions work?
- Why use `useFormStatus`?
- What is optimistic UI?
- How does `useOptimistic` work?
- What does `use()` do?
- What is the difference between Server Components and Client Components?
- What are Server Actions?
- What is `ref` as a prop?
- What changed with Context provider syntax?
- How does React 19 help metadata and resources?
- How are hydration errors improved?
- How would you explain React 18 vs React 19?
