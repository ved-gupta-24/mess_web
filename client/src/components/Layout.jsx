import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { admin, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <NavLink to="/" className="logo">🍽️ Hostel Mess</NavLink>
        <nav className="nav">
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/announcements">Announcements</NavLink>
          <NavLink to="/polls">Polls</NavLink>
          <NavLink to="/complaints">Feedback</NavLink>
          {admin ? (
            <>
              <NavLink to="/admin">Admin</NavLink>
              <button type="button" className="btn-link" onClick={logout}>Logout</button>
            </>
          ) : (
            <NavLink to="/admin/login">Admin</NavLink>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">Hostel Mess Portal</footer>
    </div>
  );
}
