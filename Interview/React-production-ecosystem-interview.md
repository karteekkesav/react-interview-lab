# React Production And Ecosystem Interview Notes

Purpose: quick interview revision with simple examples and visual mental models.

## Production React Mental Model

```text
Development code
  |
  v
Build
  |
  v
Optimized static assets
  |
  v
Hosting/CDN
  |
  v
Users
```

Production concerns:

- performance
- security
- reliability
- accessibility
- monitoring
- build size
- deployment strategy

## CSR

CSR means Client-Side Rendering.

```text
Browser loads empty HTML
  |
  v
Downloads JavaScript
  |
  v
React renders UI in browser
```

Interview answer:

CSR is simple and works well for dashboards and authenticated apps, but initial load and SEO can be weaker compared with SSR/SSG.

## SSR

SSR means Server-Side Rendering.

```text
Request page
  |
  v
Server renders HTML
  |
  v
Browser receives content
  |
  v
React hydrates
```

Interview answer:

SSR improves initial content visibility and SEO, but adds server complexity.

## SSG

SSG means Static Site Generation.

```text
Build time
  |
  v
Generate HTML
  |
  v
Serve static page
```

Interview answer:

SSG is useful for mostly static pages like marketing pages, docs, and blogs.

## Hydration

Hydration is when React attaches event handlers and interactivity to server-rendered HTML.

```text
Server HTML
  |
  v
Browser displays content
  |
  v
React loads JavaScript
  |
  v
React hydrates and adds interactivity
```

Interview answer:

Hydration makes server-rendered HTML interactive on the client.

## React Server Components

React Server Components render on the server and do not ship client JavaScript for those components.

```text
Server Component
  |
  +-- can fetch data on server
  +-- no browser JS for component

Client Component
  |
  +-- state
  +-- effects
  +-- event handlers
```

Interview answer:

Server Components can reduce client JavaScript and improve data fetching patterns, especially in frameworks like Next.js.

## React 19 Features

React 19 improves async workflows, forms, optimistic UI, and server/client integration.

Important interview topics:

- Actions API
- Form Actions
- `use()`
- `useOptimistic`
- `useFormStatus`
- Server Components improvements

## Actions API And Form Actions

Actions help handle async form submission more directly.

```jsx
async function updateName(formData) {
  const name = formData.get("name")
  await saveName(name)
}

function ProfileForm() {
  return (
    <form action={updateName}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

Interview answer:

Actions simplify async updates from forms. They are especially powerful in frameworks that support server actions.

## useOptimistic

`useOptimistic` shows an immediate UI update before the server confirms the change.

```jsx
import { useOptimistic } from "react"

function LikeButton({ initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (currentLikes) => currentLikes + 1,
  )

  async function handleLike() {
    addOptimisticLike()
    await saveLike()
  }

  return <button onClick={handleLike}>Likes: {optimisticLikes}</button>
}
```

Interview answer:

Optimistic UI improves perceived speed. If the server fails, we should show an error and rollback or refetch the real data.

## useFormStatus

`useFormStatus` reads the pending state of a parent form action.

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

Interview answer:

`useFormStatus` is useful for submit buttons because it knows whether the nearest parent form is currently submitting.

## use Hook

The `use()` hook can read promises or context in supported React environments.

```jsx
import { use } from "react"

function UserProfile({ userPromise }) {
  const user = use(userPromise)

  return <h2>{user.name}</h2>
}
```

Interview answer:

`use()` is mainly important with Suspense and modern framework patterns. I would explain it carefully and avoid using it casually in normal client components unless the framework supports the pattern.

## Streaming SSR

Streaming sends HTML progressively instead of waiting for the whole page.

```text
Server starts response
  |
  v
Send shell HTML
  |
  v
Stream slower sections later
```

Interview answer:

Streaming SSR improves perceived performance by showing useful content earlier.

## Next.js

Next.js is a React framework.

It provides:

- file-based routing
- SSR
- SSG
- Server Components
- API routes
- image optimization
- deployment patterns

Interview answer:

React is a UI library. Next.js is a framework that adds routing, rendering strategies, data fetching, and production conventions.

## StrictMode

`StrictMode` helps find potential problems during development.

```jsx
import { StrictMode } from "react"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Interview answer:

StrictMode does not run in production. In development, it may intentionally run some logic twice to reveal unsafe side effects, missing cleanup, and render purity issues.

## Web Vitals

Important metrics:

```text
LCP -> loading performance
INP -> responsiveness
CLS -> layout stability
```

Interview answer:

Web Vitals measure real user experience. I optimize images, JavaScript, rendering, and layout stability based on these metrics.

## Accessibility

Accessibility means the app works for keyboard users, screen readers, and users with disabilities.

Example:

```jsx
function EmailField({ error }) {
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" aria-describedby="email-error" />
      {error && (
        <p id="email-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

Interview answer:

I use semantic HTML, labels, keyboard support, focus management, and accessible error messages.

## Storybook

Storybook lets teams develop and document components in isolation.

```jsx
export default {
  title: "Components/Button",
  component: Button,
}

export const Primary = {
  args: {
    children: "Submit",
    variant: "primary",
  },
}
```

Interview answer:

Storybook helps document reusable components, test visual states, and improve collaboration with design/QA.

## Design System

A design system includes:

- reusable components
- design tokens
- colors
- typography
- spacing
- accessibility rules
- usage guidelines

```text
Design tokens
  |
  v
Components
  |
  v
Screens
  |
  v
Consistent product UI
```

Interview answer:

A design system improves consistency, development speed, and maintainability across large applications.

## Error Monitoring

Production apps should capture errors.

Examples:

- Sentry
- Datadog
- New Relic
- custom logging

```jsx
try {
  await submitForm()
} catch (error) {
  reportError(error)
  showToast("Unable to submit form")
}
```

Interview answer:

I handle user-facing errors in UI and send technical errors to monitoring tools for debugging.

## Feature Flags

Feature flags separate deployment from release.

```jsx
function FeatureGate({ enabled, children }) {
  if (!enabled) return null
  return children
}
```

Use cases:

- gradual rollout
- A/B tests
- disable risky feature
- release to selected users

Interview answer:

Feature flags help release safely and rollback quickly without redeploying code.

## Production Checklist

```text
Build passes
Tests pass
Lint passes
Bundle size checked
Environment variables configured
Monitoring enabled
Error boundaries in place
Accessibility checked
Security reviewed
```

## Resume-Based Examples

Stablehouse:

- secure onboarding flows
- document upload reliability
- feature flags for risky identity flows
- accessibility for forms

HNB Digital Lobby:

- Jenkins CI/CD
- lazy loading
- profiler optimization
- reusable components

## Quick Interview Summary

- CSR renders in browser.
- SSR renders on server.
- SSG renders at build time.
- Hydration adds interactivity.
- Server Components reduce client JS.
- Storybook documents components.
- Feature flags improve release safety.
- Web Vitals measure user experience.
