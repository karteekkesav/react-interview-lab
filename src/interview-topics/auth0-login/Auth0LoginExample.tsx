import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { isAuth0Configured } from '../../auth/Auth0ProviderWithConfig'

type TokenDetails = {
  accessTokenPreview: string
  accessTokenClaims: Record<string, unknown> | null
  idTokenClaims: Record<string, unknown> | null
  fetchedAt: string
  expiresAt: string | null
  issuedAt: string | null
  refreshObservation: string
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.')

  if (!payload) return null

  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
  const paddedPayload = normalizedPayload.padEnd(
    normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
    '=',
  )

  return JSON.parse(window.atob(paddedPayload)) as Record<string, unknown>
}

function formatJwtTime(value: unknown) {
  if (typeof value !== 'number') return null

  return new Date(value * 1000).toLocaleString()
}

function Auth0Controls() {
  const {
    error,
    getAccessTokenSilently,
    getIdTokenClaims,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user,
  } = useAuth0()
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null)
  const [tokenError, setTokenError] = useState('')
  const [isInspectingToken, setIsInspectingToken] = useState(false)

  async function inspectTokens() {
    try {
      setIsInspectingToken(true)
      setTokenError('')

      const previousPreview = tokenDetails?.accessTokenPreview
      const accessToken = await getAccessTokenSilently()
      const idTokenClaims = await getIdTokenClaims()
      const accessTokenClaims = decodeJwtPayload(accessToken)
      const nextPreview = `${accessToken.slice(0, 18)}...${accessToken.slice(-8)}`

      setTokenDetails({
        accessTokenPreview: nextPreview,
        accessTokenClaims,
        idTokenClaims: idTokenClaims
          ? (idTokenClaims as Record<string, unknown>)
          : null,
        fetchedAt: new Date().toLocaleString(),
        expiresAt: formatJwtTime(accessTokenClaims?.exp),
        issuedAt: formatJwtTime(accessTokenClaims?.iat),
        refreshObservation:
          previousPreview && previousPreview !== nextPreview
            ? 'A different token was returned. Auth0 SDK may have refreshed or reissued it.'
            : 'The SDK returned the current usable token. It refreshes silently when needed.',
      })
    } catch (caughtError) {
      setTokenError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to inspect Auth0 token.',
      )
    } finally {
      setIsInspectingToken(false)
    }
  }

  if (isLoading) {
    return <p className="status-box">Checking Auth0 session...</p>
  }

  if (error) {
    return <p className="status-box">Auth error: {error.message}</p>
  }

  if (!isAuthenticated) {
    return (
      <div className="demo-stack">
        <div className="demo-card">
          <div>
            <h3>Unauthenticated user</h3>
            <p>
              The user can see public content, but onboarding screens should be
              protected.
            </p>
          </div>
          <strong>Public</strong>
        </div>

        <button type="button" onClick={() => loginWithRedirect()}>
          Login with Auth0
        </button>
      </div>
    )
  }

  return (
    <div className="demo-stack">
      <div className="demo-card">
        <div>
          <h3>{user?.name ?? 'Authenticated user'}</h3>
          <p>{user?.email ?? 'Profile loaded from Auth0 ID token claims.'}</p>
        </div>
        <strong>Protected</strong>
      </div>

      <div className="demo-card">
        <div>
          <h3>Stablehouse onboarding area</h3>
          <p>
            POI, POA, Investor Type, Account Type, and Liveness Verification can
            be shown only after authentication.
          </p>
        </div>
        <strong>Auth guard passed</strong>
      </div>

      <div className="button-row">
        <button
          type="button"
          onClick={inspectTokens}
          disabled={isInspectingToken}
        >
          {isInspectingToken ? 'Inspecting token...' : 'Inspect tokens'}
        </button>
        <button
          type="button"
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

      {tokenError ? <p className="field-error">{tokenError}</p> : null}

      {tokenDetails ? (
        <div className="demo-stack">
          <dl className="definition-list">
            <dt>Fetched at</dt>
            <dd>{tokenDetails.fetchedAt}</dd>
            <dt>Access token</dt>
            <dd>{tokenDetails.accessTokenPreview}</dd>
            <dt>Issued at</dt>
            <dd>{tokenDetails.issuedAt ?? 'Not available'}</dd>
            <dt>Expires at</dt>
            <dd>{tokenDetails.expiresAt ?? 'Not available'}</dd>
            <dt>Refresh behavior</dt>
            <dd>{tokenDetails.refreshObservation}</dd>
          </dl>

          <div className="demo-card">
            <div>
              <h3>How refresh works</h3>
              <p>
                This app does not refresh tokens with a manual timer. When a
                protected API needs a token, `getAccessTokenSilently()` asks the
                SDK for a usable access token. If the old token is expired or
                close to expiry, Auth0 can use the refresh-token/session flow to
                return a new one.
              </p>
            </div>
            <strong>SDK managed</strong>
          </div>

          <details className="token-details">
            <summary>Access token claims</summary>
            <pre>
              {tokenDetails.accessTokenClaims
                ? JSON.stringify(tokenDetails.accessTokenClaims, null, 2)
                : 'Access token is not a decodable JWT. Add an Auth0 API audience if you need API JWT claims.'}
            </pre>
          </details>

          <details className="token-details">
            <summary>ID token claims</summary>
            <pre>{JSON.stringify(tokenDetails.idTokenClaims, null, 2)}</pre>
          </details>
        </div>
      ) : null}
    </div>
  )
}

export default function Auth0LoginExample() {
  if (!isAuth0Configured) {
    return (
      <div className="demo-stack">
        <div className="demo-card">
          <div>
            <h3>Auth0 credentials needed</h3>
            <p>
              Add your Auth0 domain and client ID to `.env.local`, then restart
              the Vite dev server.
            </p>
          </div>
          <strong>Setup required</strong>
        </div>

        <div className="status-box">
          <span>Required env vars</span>
          <strong>VITE_AUTH0_DOMAIN + VITE_AUTH0_CLIENT_ID</strong>
        </div>
      </div>
    )
  }

  return <Auth0Controls />
}
