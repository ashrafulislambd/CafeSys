import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './supertokens'
import { SuperTokensWrapper } from 'supertokens-auth-react'
import { App } from './App'

/*SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/references/frontend-sdks/reference#sdk-configuration
    appName: "Order Microservice",
    apiDomain: "http://localhost:8000",
    websiteDomain: "http://localhost:80",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
});*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SuperTokensWrapper>
      <App />
    </SuperTokensWrapper>
  </StrictMode>,
)
