import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui'
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui'
import Session from 'supertokens-auth-react/recipe/session'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { OrderPage } from './pages/OrderPage'
import { AdminPage } from './pages/AdminPage'
import * as reactRouterDom from 'react-router-dom'

const authRoutes = getSuperTokensRoutesForReactRouterDom(reactRouterDom, [EmailPasswordPreBuiltUI])

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/order"
            element={
              <Session.SessionAuth requireAuth>
                <OrderPage />
              </Session.SessionAuth>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          {authRoutes}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
