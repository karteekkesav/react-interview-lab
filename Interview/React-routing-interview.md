# React Router Interview Notes

Purpose: quick interview revision with simple JavaScript examples.

## Where React Router Fits

React Router deserves a separate interview file because routing includes navigation, params, query strings, protected routes, nested layouts, lazy routes, and 404 handling.

Interview answer:

React Router enables client-side navigation in a React single-page application without full page reloads.

## Basic Router Setup

```jsx
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"

function Home() {
  return <h1>Home</h1>
}

function About() {
  return <h1>About</h1>
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## React Router Step-By-Step Setup

Use this flow when the interviewer asks, "How do you configure routing in a React app?"

```text
1. Install react-router-dom
   |
   v
2. Wrap app with BrowserRouter
   |
   v
3. Define Routes and Route elements
   |
   v
4. Add Link/NavLink for navigation
   |
   v
5. Add protected, nested, lazy, and 404 routes as needed
```

### Step 1: Wrap App With BrowserRouter

File: `src/main.jsx`

```jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
```

### Step 2: Create App Routes

File: `src/App.jsx`

```jsx
import { Link, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
```

Interview answer:

I wrap the app with `BrowserRouter`, define route mappings using `Routes` and `Route`, and use `Link` or `NavLink` for client-side navigation without page reload.

## BrowserRouter Vs HashRouter

```text
BrowserRouter
  |
  +-- clean URLs
  +-- /dashboard
  +-- needs server fallback

HashRouter
  |
  +-- hash-based URLs
  +-- /#/dashboard
  +-- useful when server fallback is not available
```

Interview answer:

I prefer `BrowserRouter` for modern apps when the server is configured to serve `index.html` for unknown routes.

## NavLink

`NavLink` helps style active links.

```jsx
import { NavLink } from "react-router-dom"

function Menu() {
  return (
    <nav>
      <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/">
        Home
      </NavLink>
    </nav>
  )
}
```

## Route Params

Use `useParams` for dynamic URL segments.

```jsx
import { useParams } from "react-router-dom"

function UserDetails() {
  const { userId } = useParams()

  return <p>User ID: {userId}</p>
}
```

Route:

```jsx
<Route path="/users/:userId" element={<UserDetails />} />
```

Interview answer:

Route params are useful for entity pages like user details, transaction details, or onboarding step details.

## Search Params

Use search params for filters, sorting, and pagination.

```jsx
import { useSearchParams } from "react-router-dom"

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get("page") || "1"

  function goNext() {
    setSearchParams({ page: String(Number(page) + 1) })
  }

  return (
    <div>
      <p>Current page: {page}</p>
      <button onClick={goNext}>Next</button>
    </div>
  )
}
```

Interview answer:

Search params are good for shareable URL state like page, filters, tabs, and sort order.

## Protected Routes

Protected routes restrict private screens.

```jsx
import { Navigate } from "react-router-dom"

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

Usage:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

Important:

Frontend route protection improves UX, but backend APIs must still validate authentication and authorization.

## Nested Routes And Layout Routes

Nested routes share layout.

```jsx
import { Outlet } from "react-router-dom"

function DashboardLayout() {
  return (
    <div>
      <aside>Dashboard Menu</aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

Routes:

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="overview" element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

Interview answer:

Nested routes are useful when multiple screens share the same layout, such as dashboards or onboarding flows.

## Lazy Loading Routes

```jsx
import { lazy, Suspense } from "react"

const Dashboard = lazy(() => import("./Dashboard"))

function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  )
}
```

Interview answer:

Lazy route loading reduces initial bundle size by loading large pages only when users visit them.

## 404 Not Found Route

```jsx
function NotFound() {
  return <h1>Page not found</h1>
}

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Resume-Based Examples

Stablehouse:

- protected onboarding routes
- route per onboarding step
- POI, POA, Investor Type, Account Type, Liveness Verification
- redirect based on onboarding status

Example structure:

```text
/onboarding/poi
/onboarding/poa
/onboarding/investor-type
/onboarding/account-type
/onboarding/liveness
```

HNB Digital Lobby:

- dashboard routes
- nested layout routes
- search params for filters and pagination
- lazy loading for large modules

## Quick Interview Summary

- Use `BrowserRouter` for clean URLs.
- Use `HashRouter` if server fallback is unavailable.
- Use `useParams` for dynamic segments.
- Use `useSearchParams` for shareable filters/pagination.
- Use protected routes for UX, but backend still enforces security.
- Use nested routes for shared layouts.
- Use lazy routes for bundle optimization.
