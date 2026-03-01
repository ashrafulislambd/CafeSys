import { Outlet, Link, useNavigate } from 'react-router-dom'
import Session from 'supertokens-auth-react/recipe/session'

function Header() {
  const navigate = useNavigate()
  const sessionContext = Session.useSessionContext()

  const isLoading = sessionContext && 'loading' in sessionContext && sessionContext.loading === true
  const hasSession =
    sessionContext && 'doesSessionExist' in sessionContext && sessionContext.doesSessionExist === true

  const handleSignOut = async () => {
    await Session.signOut()
    navigate('/')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-slate-800 font-semibold tracking-tight">
          IUT Cafeteria
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/order"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Order
          </Link>
          <Link
            to="/admin"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Admin
          </Link>
          {!isLoading && (
            hasSession ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
