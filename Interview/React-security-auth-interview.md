# React Security And Authentication Interview Notes

Purpose: quick interview revision with simple examples, visual mental models, and resume-based talking points.

## Security Mental Model

Frontend security is mostly about reducing risk and improving user experience. The backend is the real enforcement layer.

```text
React frontend
  |
  +-- hide/show screens
  +-- protect routes for UX
  +-- send tokens to APIs
  +-- validate inputs for user experience
  |
  v
Backend
  |
  +-- validate token
  +-- check permissions
  +-- validate data again
  +-- enforce real authorization
```

Interview answer:

Frontend checks are important, but they are not enough for security. The backend must validate authentication, authorization, input data, and sensitive operations.

## Authentication Vs Authorization

```text
Authentication
  |
  +-- Who is the user?

Authorization
  |
  +-- What can the user access?
```

Example:

```text
Authenticated user
  |
  v
Can access dashboard?
  |
  +-- yes -> show dashboard
  +-- no  -> show forbidden page
```

Interview answer:

Authentication verifies identity. Authorization verifies permissions. A user may be logged in but still not allowed to access a specific onboarding step or admin screen.

## Auth0 Login Flow

```text
React app
  |
  | loginWithRedirect()
  v
Auth0 Universal Login
  |
  | user authenticates
  v
Redirect back to React app
  |
  v
Auth0Provider restores session
  |
  v
useAuth0 exposes user/token state
```

Example:

```jsx
import { useAuth0 } from "@auth0/auth0-react"

function LoginButton() {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0()

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome {user.name}</p>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </button>
      </div>
    )
  }

  return <button onClick={() => loginWithRedirect()}>Login</button>
}
```

Interview answer:

Auth0 handles secure login and token issuance. React uses `Auth0Provider` and `useAuth0` to access login, logout, user profile, and access token functions.

## Auth0 Step-By-Step Setup

Use this flow when the interviewer asks, "How did you implement Auth0 login in React?"

```text
1. Create Auth0 SPA application
   |
   v
2. Add callback/logout/origin URLs in Auth0 dashboard
   |
   v
3. Store domain and client ID in env variables
   |
   v
4. Wrap React app with Auth0Provider
   |
   v
5. Use useAuth0 for login/logout/user/token
   |
   v
6. Protect private routes
```

Environment variables:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

Provider setup:

```jsx
import { Auth0Provider } from "@auth0/auth0-react"

function AuthProvider({ children }) {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      useRefreshTokens={true}
      cacheLocation="memory"
    >
      {children}
    </Auth0Provider>
  )
}
```

Login/logout usage:

```jsx
import { useAuth0 } from "@auth0/auth0-react"

function AuthButtons() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Login</button>
  }

  return (
    <div>
      <p>{user.email}</p>
      <button
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
      >
        Logout
      </button>
    </div>
  )
}
```

Interview answer:

I configure Auth0 as a Single Page Application, add allowed callback/logout URLs, wrap React with `Auth0Provider`, use `loginWithRedirect` and `logout`, and call `getAccessTokenSilently()` before protected API calls. The backend still validates the access token and permissions.

## Protected Routes

Protected routes prevent unauthenticated users from seeing private screens.

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
  path="/onboarding"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Onboarding />
    </ProtectedRoute>
  }
/>
```

Important:

```text
Protected route = frontend UX guard
Backend authorization = real security
```

## Access Tokens For APIs

Use access tokens to call protected APIs.

```jsx
import { useAuth0 } from "@auth0/auth0-react"

function LoadProfileButton() {
  const { getAccessTokenSilently } = useAuth0()

  async function loadProfile() {
    const token = await getAccessTokenSilently()

    const response = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    console.log(data)
  }

  return <button onClick={loadProfile}>Load Profile</button>
}
```

Backend should validate:

- issuer
- audience
- expiry
- signature
- permissions/scopes

## ID Token Vs Access Token

```text
ID token
  |
  +-- proves who the user is
  +-- used by frontend for profile claims

Access token
  |
  +-- authorizes API access
  +-- sent to backend
```

Interview answer:

Use ID token for user identity in the client. Use access token for protected APIs.

## Refresh Tokens

Refresh tokens help obtain a new access token without forcing login again.

Auth0 SDK pattern:

```jsx
<Auth0Provider useRefreshTokens cacheLocation="memory">
  <App />
</Auth0Provider>
```

Mental model:

```text
App needs token
  |
  v
getAccessTokenSilently()
  |
  +-- access token valid -> return token
  |
  +-- token expired -> SDK refreshes silently
```

Interview answer:

I do not manually refresh tokens with `setInterval`. I call `getAccessTokenSilently()` when the app needs a token, and the Auth0 SDK handles refresh when needed.

## XSS

XSS means Cross-Site Scripting. It happens when malicious script runs in the user's browser.

React helps by escaping values by default:

```jsx
function Comment({ text }) {
  return <p>{text}</p>
}
```

If `text` contains:

```html
<script>alert("hack")</script>
```

React renders it as text, not as executable script.

Dangerous:

```jsx
function HtmlPreview({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

Interview answer:

React escapes content by default, which helps reduce XSS risk. I avoid `dangerouslySetInnerHTML`, sanitize any HTML from users, and never trust frontend-only validation.

## CSRF

CSRF means Cross-Site Request Forgery. It occurs when a malicious website tricks a logged-in user's browser into sending an unwanted authenticated request to another website.

The attacker does not need to steal the user's password or session cookie. The attack exploits the browser's ability to attach authentication cookies automatically.

### Mental Model

```text
User logs in to bank.example
  |
  v
Browser stores the session cookie
  |
  v
User visits attacker.example
  |
  v
Attacker's page submits a request to bank.example
  |
  v
Browser may attach the bank cookie automatically
  |
  v
The bank sees an authenticated request
```

The core problem is that the server can identify the user from the cookie but cannot automatically prove that the user intentionally initiated the request.

### Attack Example

Assume the application accepts this request:

```http
POST https://bank.example/transfer

amount=5000&to=attacker
```

An attacker can place this form on another website:

```html
<form id="attack" action="https://bank.example/transfer" method="POST">
  <input type="hidden" name="amount" value="5000" />
  <input type="hidden" name="to" value="attacker" />
</form>

<script>
  document.querySelector("#attack").submit()
</script>
```

If the browser is permitted to include the bank session cookie, the server may process the transfer as the authenticated user. The attacker usually cannot read the response because of the same-origin policy, but reading it is unnecessary if the unwanted action succeeds.

### When Is An Application Vulnerable?

CSRF is primarily relevant when the browser sends credentials automatically, including:

- session or authentication cookies
- some HTTP authentication mechanisms
- client certificates

A React SPA is not automatically protected:

```jsx
fetch("/api/profile", {
  method: "PATCH",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email: "new@example.com" }),
})
```

The React client can send CSRF protection data, but the backend must validate it.

A bearer token manually added to an `Authorization` header is generally less exposed to traditional CSRF because another origin cannot make the browser add that header automatically. JavaScript-accessible token storage has a different risk: XSS can steal the token.

### CSRF Defenses

#### 1. CSRF Token

The server generates a secret, unpredictable token associated with the user's session. The client sends it with every state-changing request:

```jsx
async function updateProfile(profile, csrfToken) {
  return fetch("/api/profile", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(profile),
  })
}
```

The backend rejects missing or invalid tokens:

```js
app.patch("/api/profile", requireAuthentication, (request, response) => {
  if (request.get("X-CSRF-Token") !== request.session.csrfToken) {
    return response.status(403).json({ message: "Invalid CSRF token" })
  }

  // Perform the update.
})
```

Stateful applications commonly use the synchronizer-token pattern. Stateless applications can use a properly implemented signed double-submit-cookie pattern.

#### 2. SameSite Cookies

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```

```text
Strict -> do not include the cookie in cross-site requests
Lax    -> allow limited cross-site navigation behavior
None   -> allow cross-site use; Secure is required
```

`SameSite` is useful defense in depth, but it should not be the only defense for most applications. `Lax` has limitations around top-level navigation, and sibling subdomains can still be considered same-site.

#### 3. Validate Origin

For state-changing requests, the backend can validate the complete `Origin` value against a strict allowlist and use `Referer` as a carefully handled fallback.

```js
const allowedOrigins = new Set(["https://app.example.com"])

if (!allowedOrigins.has(request.get("Origin"))) {
  return response.sendStatus(403)
}
```

Do not use substring matching because a domain such as `app.example.com.attacker.example` must not be accepted.

#### 4. Configure CORS Strictly

CORS and CSRF solve different problems. CORS mainly controls whether cross-origin JavaScript can send certain requests or read responses; it is not a complete CSRF defense.

For credentialed requests, allow only explicitly trusted origins:

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

Do not reflect arbitrary origins. A weak CORS configuration can undermine defenses based on custom request headers.

#### 5. Use Safe HTTP Semantics

`GET`, `HEAD`, and `OPTIONS` should not change server state. Apply CSRF protection to state-changing `POST`, `PUT`, `PATCH`, and `DELETE` endpoints.

```text
GET /account/delete -> unsafe design
DELETE /account     -> correct method plus CSRF validation
```

#### 6. Add Confirmation For Sensitive Actions

For money transfers, password changes, account deletion, or similar operations, require recent authentication, password confirmation, MFA, an OTP, or explicit transaction confirmation.

Modern backends can also inspect Fetch Metadata headers such as `Sec-Fetch-Site` to reject obvious cross-site state-changing requests.

### CSRF Vs XSS

```text
CSRF
  -> forces an unwanted authenticated request

XSS
  -> executes attacker-controlled JavaScript inside the trusted application
```

XSS can often bypass CSRF defenses because malicious same-origin JavaScript may read CSRF tokens and send valid requests. Both vulnerabilities must be addressed.

### CSRF Interview Q&A

#### 1. What Is CSRF?

CSRF tricks an authenticated browser into performing an unwanted action by exploiting automatically attached credentials, usually cookies.

#### 2. Must The Attacker Steal The Session Cookie?

No. The attacker relies on the victim's browser attaching the cookie automatically.

#### 3. Must The Attacker Read The Response?

No. Causing a state-changing action such as an email change, purchase, or transfer may be enough.

#### 4. Why Are Cookie-Authenticated Applications At Risk?

Cookies are ambient credentials. The browser can attach eligible cookies regardless of which website initiated the request.

#### 5. Does React Prevent CSRF?

No. CSRF is mainly a browser and backend security concern. React can send a CSRF token, but the backend must generate and validate it.

#### 6. Does CORS Prevent CSRF?

Not by itself. Some cross-origin requests can still be sent even when JavaScript cannot read the response. Strict CORS supports custom-header defenses but is not a replacement for CSRF validation.

#### 7. Is SameSite=Lax Complete Protection?

No. It blocks many attacks but has limitations. Treat it as defense in depth and combine it with token or origin-based protection according to the application's threat model.

#### 8. What Is The Synchronizer-Token Pattern?

The server creates an unpredictable token associated with the user's session. The client returns it with state-changing requests, and the server validates it.

#### 9. What Is The Double-Submit-Cookie Pattern?

The client sends a token both as a cookie and as a separate request value, commonly a header. The server validates that they match. A secure implementation signs or binds the token appropriately.

#### 10. Are Bearer Tokens Immune To CSRF?

Tokens manually placed in an `Authorization` header are generally less exposed to traditional CSRF because browsers do not attach them automatically. They can still be exposed through XSS or insecure storage.

### Interview Answer

CSRF occurs when a malicious site causes a logged-in browser to send an unintended authenticated request using automatically attached credentials, usually cookies. I prevent it with server-validated CSRF tokens or protected custom headers, appropriate `SameSite`, `Secure`, and `HttpOnly` cookie settings, strict origin and CORS validation, safe HTTP semantics, and additional confirmation for sensitive operations. React can send the token, but the backend must enforce the protection.

References:

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN CSRF Guide](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)
- [MDN Secure Cookie Configuration](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies)

## Environment Variables

In Vite, only variables prefixed with `VITE_` are exposed to the browser.

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

Never store:

```text
client secrets
private keys
database passwords
backend-only credentials
```

Interview answer:

Frontend environment variables are not secrets because browser bundles are visible to users.

## Role-Based Access Control

```text
User
  |
  v
roles/permissions
  |
  +-- canUploadPOI
  +-- canUploadPOA
  +-- canViewDashboard
```

Example:

```jsx
function PermissionGate({ canAccess, children }) {
  if (!canAccess) {
    return <p>You do not have permission.</p>
  }

  return children
}
```

Usage:

```jsx
<PermissionGate canAccess={permissions.canUploadPOI}>
  <PoiUpload />
</PermissionGate>
```

Interview answer:

Permission checks in React improve UX, but backend APIs must enforce the same permissions.

## Stablehouse Resume Example

In Stablehouse onboarding:

- Auth0 can authenticate users.
- Protected routes can restrict onboarding pages.
- permissions can control POI/POA/Liveness access.
- access tokens can protect document upload APIs.
- backend must validate every sensitive request.

Interview answer:

For a FinTech onboarding flow, I would protect routes, restore session on refresh, send access tokens to APIs, and rely on backend authorization for sensitive operations like POI/POA upload and identity verification.

## Quick Interview Summary

- Authentication means who the user is.
- Authorization means what the user can access.
- Protected routes are UX, not real security.
- Access tokens are for APIs.
- ID tokens are for identity claims.
- React escapes values by default to reduce XSS.
- CSRF is mainly a cookie-auth risk.
- Frontend env vars are not secrets.
