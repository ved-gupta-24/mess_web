import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu as MenuIcon, X, LogOut, UtensilsCrossed, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { admin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-600 text-white shadow-sm shadow-brand-200 dark:shadow-none'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 text-brand-700 dark:text-brand-500 hover:opacity-90 transition-opacity">
              <UtensilsCrossed className="h-6 w-6 text-brand-600 dark:text-brand-500" />
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Zanskar Mess</span>
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/menu" className={linkClass}>Menu</NavLink>
              <NavLink to="/announcements" className={linkClass}>Announcements</NavLink>
              <NavLink to="/polls" className={linkClass}>Polls</NavLink>
              <NavLink to="/complaints" className={linkClass}>Feedback</NavLink>
              
              <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              
              {/* Theme Switcher Button */}
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-1"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
              </button>

              {admin ? (
                <div className="flex items-center gap-2">
                  <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink to="/admin/login" className={linkClass}>Admin</NavLink>
              )}
            </nav>

            {/* Mobile Header buttons */}
            <div className="flex items-center gap-1.5 md:hidden">
              {/* Theme Switcher Button */}
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/menu" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Menu</NavLink>
              <NavLink to="/announcements" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Announcements</NavLink>
              <NavLink to="/polls" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Polls</NavLink>
              <NavLink to="/complaints" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Feedback</NavLink>
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2" />
              {admin ? (
                <>
                  <NavLink to="/admin" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Admin Dashboard</NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
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

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
          <div>
            &copy; {new Date().getFullYear()} Zanskar Mess. All rights reserved.
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span>Mess Secy: <strong className="text-slate-700 dark:text-slate-300 font-semibold">Divy Kalyani</strong></span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span>Site managed by <strong className="text-slate-700 dark:text-slate-300 font-semibold">Vedant Gupta</strong> (Technical Secretary)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
