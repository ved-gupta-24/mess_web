import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu as MenuIcon, X, LogOut, UtensilsCrossed } from 'lucide-react';

export default function Layout() {
  const { admin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-600 text-white shadow-sm shadow-brand-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 text-brand-700 hover:opacity-90 transition-opacity">
              <UtensilsCrossed className="h-6 w-6 text-brand-600" />
              <span className="font-bold text-lg tracking-tight text-slate-900">Hostel Mess</span>
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/menu" className={linkClass}>Menu</NavLink>
              <NavLink to="/announcements" className={linkClass}>Announcements</NavLink>
              <NavLink to="/polls" className={linkClass}>Polls</NavLink>
              <NavLink to="/complaints" className={linkClass}>Feedback</NavLink>
              <span className="h-4 w-px bg-slate-200 mx-2" />
              {admin ? (
                <div className="flex items-center gap-2">
                  <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink to="/admin/login" className={linkClass}>Admin</NavLink>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white shadow-lg" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/menu" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Menu</NavLink>
              <NavLink to="/announcements" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Announcements</NavLink>
              <NavLink to="/polls" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Polls</NavLink>
              <NavLink to="/complaints" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Feedback</NavLink>
              <div className="border-t border-slate-100 my-2 pt-2" />
              {admin ? (
                <>
                  <NavLink to="/admin" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Admin Dashboard</NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/admin/login" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Admin Login</NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Hostel Mess Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
