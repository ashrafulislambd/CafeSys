import { Link } from "react-router-dom";
import Session from "supertokens-auth-react/recipe/session";

export function HomePage() {
  const sessionContext = Session.useSessionContext();
  const isLoading =
    sessionContext &&
    "loading" in sessionContext &&
    sessionContext.loading === true;
  const hasSession =
    sessionContext &&
    "doesSessionExist" in sessionContext &&
    sessionContext.doesSessionExist === true;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-white/20 border-t-cyan-300 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[68vh] flex items-center justify-center px-4">
      <section className="app-card w-full max-w-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-slate-50 mb-2">
          IUT Cafeteria
        </h1>
        <p className="app-muted text-sm mb-8 max-w-sm mx-auto">
          Order your Iftar meal and track status in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hasSession ? (
            <Link
              to="/order"
              className="inline-flex items-center justify-center app-btn-primary"
            >
              Go to orders
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center app-btn-neutral"
              >
                Sign in
              </Link>
              <Link
                to="/order"
                className="inline-flex items-center justify-center app-btn-primary"
              >
                Order now
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
