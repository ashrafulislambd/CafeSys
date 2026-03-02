import { Link } from 'react-router-dom'
import Session from 'supertokens-auth-react/recipe/session'

export function HomePage() {
  const sessionContext = Session.useSessionContext()
  const isLoading = sessionContext && 'loading' in sessionContext && sessionContext.loading === true
  const hasSession =
    sessionContext && 'doesSessionExist' in sessionContext && sessionContext.doesSessionExist === true

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        IUT Cafeteria
      </h1>
      <p className="text-slate-600 text-sm mb-8 max-w-sm">
        Order your Iftar meal and track status in real time.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {hasSession ? (
          <Link
            to="/order"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Go to orders
          </Link>
        ) : (
          <>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/order"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Order now
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
