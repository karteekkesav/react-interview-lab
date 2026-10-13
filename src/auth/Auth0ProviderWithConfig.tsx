import { Auth0Provider } from '@auth0/auth0-react'
import type { ReactNode } from 'react'

type Auth0ProviderWithConfigProps = {
  children: ReactNode
}

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
}

export const isAuth0Configured = Boolean(
  auth0Config.domain && auth0Config.clientId,
)

export default function Auth0ProviderWithConfig({
  children,
}: Auth0ProviderWithConfigProps) {
  if (!isAuth0Configured || !auth0Config.domain || !auth0Config.clientId) {
    return children
  }

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Config.audience || undefined,
      }}
      cacheLocation="memory"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  )
}
