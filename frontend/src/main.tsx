import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './supertokens'
import { SuperTokensWrapper } from 'supertokens-auth-react'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SuperTokensWrapper>
      <App />
    </SuperTokensWrapper>
  </StrictMode>,
)
