import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import Auth0ProviderWithConfig from './auth/Auth0ProviderWithConfig'
import { store } from './store/store'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <Auth0ProviderWithConfig>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0ProviderWithConfig>
    </Provider>
  </StrictMode>,
)
