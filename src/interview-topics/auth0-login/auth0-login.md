# Auth0 Login

## Interview Definition

Auth0 is an identity platform that handles authentication flows such as login, signup, logout, session management, social login, enterprise SSO, and token issuance. In React, the official SDK exposes `Auth0Provider` and the `useAuth0` hook.

## Why This Matters For Your Resume

Your latest Stablehouse FinTech project is the strongest project to explain Auth0. FinTech onboarding flows such as POI, POA, Investor Type, Account Type, document upload, and Liveness Verification contain sensitive user information. Authentication makes sure only valid users can access those screens.

Interview answer:

In my latest FinTech project, we used Auth0 for authentication. In React, Auth0 is usually configured at the app root with `Auth0Provider`. Components use `useAuth0` for login, logout, user profile, loading state, and access tokens. For protected APIs, the frontend sends the access token in the `Authorization` header, and the backend validates issuer, audience, expiration, and permissions.

## Flow Diagram

```text
React App
  |
  | loginWithRedirect()
  v
Auth0 Universal Login
  |
  | redirects back to app
  v
Auth0Provider restores auth state
  |
  +-- useAuth0()
  +-- user profile
  +-- access token for APIs
```

## Setup Steps

Create an Auth0 Single Page Application and configure:

- Allowed Callback URL: `http://localhost:5173`
- Allowed Logout URL: `http://localhost:5173`
- Allowed Web Origins: `http://localhost:5173`

Create `.env.local`:

```env
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-spa-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

Important:

`VITE_AUTH0_CLIENT_ID` and `VITE_AUTH0_DOMAIN` are not secrets. Never put an Auth0 client secret in React code.

For this repository, unauthenticated users see only the login screen. After login, the full interview topic dashboard is visible. Logout redirects back to the app origin, where the login screen appears again.

## Refresh Tokens

This app enables refresh-token support in the Auth0 React SDK with `useRefreshTokens`.

```tsx
<Auth0Provider
  domain={domain}
  clientId={clientId}
  useRefreshTokens
  cacheLocation="memory"
>
  <App />
</Auth0Provider>
```

Auth0 dashboard requirement:

Enable Refresh Token Rotation for the Single Page Application in Auth0 dashboard. This allows the SDK to renew access tokens without asking the user to log in again.

Interview note:

For browser apps, refresh tokens should be handled carefully. Keeping tokens in memory is safer against persistent XSS token theft, but the app may need to restore the session through Auth0 after a hard refresh. `localstorage` can persist tokens across refreshes, but it increases risk if an attacker can run JavaScript in the page.

## Provider Setup

```tsx
<Auth0Provider
  domain={domain}
  clientId={clientId}
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience,
  }}
>
  <App />
</Auth0Provider>
```

## Login And Logout

```tsx
const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0()

return isAuthenticated ? (
  <>
    <p>Welcome {user?.name}</p>
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Logout
    </button>
  </>
) : (
  <button onClick={() => loginWithRedirect()}>Login</button>
)
```

## Protected API Call

```tsx
const { getAccessTokenSilently } = useAuth0()

async function loadProtectedData() {
  const token = await getAccessTokenSilently()

  const response = await fetch("/api/onboarding/status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}
```

## Token Inspection For Interview Debugging

This folder's runnable example includes an **Inspect tokens** button.

It demonstrates:

- how to request an access token with `getAccessTokenSilently()`
- how to preview the token without printing the full value by default
- how to decode JWT-style claims
- how to read `iat` issued-at time
- how to read `exp` expiry time
- how to compare repeated token requests

Refresh behavior:

```text
Component calls getAccessTokenSilently()
        |
        v
Auth0 SDK checks current token
        |
        +-- still valid -> returns usable token
        |
        +-- expired / near expiry -> silently gets a new token
```

Important:

The app does not use a manual `setInterval` to refresh tokens. The SDK refreshes tokens when the app asks for a token and Auth0 determines a new token is needed.

If the access token is not a decodable JWT, add an Auth0 API audience. Without a custom API audience, Auth0 may return a token that is not useful for backend API authorization demos.

## ID Token Vs Access Token

ID token:

- tells the frontend who the user is
- contains profile claims
- used by the client application

Access token:

- used to call protected APIs
- should be validated by backend services
- represents authorization to access resources

## Authentication Vs Authorization

Authentication answers: who is the user?

Authorization answers: what is the user allowed to access?

Example:

An authenticated Stablehouse user can log in, but only users with the correct onboarding permissions should access POI, POA, or Liveness Verification screens.

## Common Interview Questions

Why use Auth0 instead of building login manually?

Auth0 handles secure login flows, token issuance, social login, enterprise SSO, MFA, password policies, and common security details. This lets the product team focus on business flows.

What is Universal Login?

Universal Login is Auth0-hosted login UI. The user is redirected to Auth0, authenticates there, and then returns to the React app.

Where do you store the client secret?

Never in React. SPAs are public clients, so they do not safely store secrets.

How do protected routes work?

The frontend checks auth state and redirects unauthenticated users. The backend must still validate tokens for real security.

How do you call protected APIs?

Get an access token silently and send it as `Authorization: Bearer <token>`.

## Common Mistakes

- Putting Auth0 client secret in frontend env variables.
- Protecting only frontend routes without backend token validation.
- Forgetting callback, logout, and web origin URLs in Auth0 dashboard.
- Forgetting to enable Refresh Token Rotation when refresh tokens are needed.
- Treating ID token and access token as the same thing.
- Not handling loading and error states.

## Quick Revision Notes

Use `Auth0Provider` at the app root.

Use `useAuth0` for login, logout, user, loading, and token access.

Use access tokens for APIs, not ID tokens.

Frontend route protection is UX. Backend token validation is security.
