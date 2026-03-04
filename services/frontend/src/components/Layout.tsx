import { Outlet, Link, useNavigate } from "react-router-dom";
import Session from "supertokens-auth-react/recipe/session";

function Header() {
  const navigate = useNavigate();
  const sessionContext = Session.useSessionContext();

  const isLoading =
    sessionContext &&
    "loading" in sessionContext &&
    sessionContext.loading === true;
  const hasSession =
    sessionContext &&
    "doesSessionExist" in sessionContext &&
    sessionContext.doesSessionExist === true;

  const handleSignOut = async () => {
    await Session.signOut();
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-brand">
          IUT Cafeteria
        </Link>
        <nav className="app-nav">
          <Link to="/" className="app-link">
            Home
          </Link>
          <Link to="/order" className="app-link">
            Order
          </Link>
          <Link to="/admin" className="app-link">
            Admin
          </Link>
          {!isLoading &&
            (hasSession ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="app-link"
              >
                Sign out
              </button>
            ) : (
              <Link to="/auth" className="app-link-accent">
                Sign in
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}

export function Layout() {
  return (
    <div className="app-shell font-sans">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
