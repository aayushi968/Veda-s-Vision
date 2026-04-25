import { NavLink } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 transition sm:px-4 ${isActive ? 'bg-herbal text-white' : 'hover:bg-neem/15 text-charcoal'}`;

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-marigold/50 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1380px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-herbal to-neem text-sm text-white shadow-md">
            VV
          </span>
          <NavLink to="/" end className="text-base font-semibold tracking-wide text-herbal sm:text-lg">
            Veda's Vision
          </NavLink>
        </div>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          {user && <NavLink to="/history" className={navLinkClass}>History</NavLink>}
          {user ? (
            <button onClick={logout} className="ml-1 rounded-full bg-herbal px-4 py-2 text-sm text-white transition hover:bg-neem">
              Sign out
            </button>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <NavLink
                to="/?auth=signin&modal=1"
                className="rounded-full border border-herbal/50 bg-white px-4 py-2 text-herbal transition hover:-translate-y-0.5 hover:bg-herbal/5"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/?auth=signup&modal=1"
                className="rounded-full bg-gradient-to-r from-turmeric to-marigold px-4 py-2 font-semibold text-charcoal shadow-md transition hover:-translate-y-0.5"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
