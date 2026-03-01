import SuperTokens from 'supertokens-auth-react'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'
import Session from 'supertokens-auth-react/recipe/session'

const origin = typeof window !== 'undefined' ? window.location.origin : ''

SuperTokens.init({
  appInfo: {
    appName: 'IUT Cafeteria',
    apiDomain: origin,
    websiteDomain: origin,
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [EmailPassword.init(), Session.init()],
})
