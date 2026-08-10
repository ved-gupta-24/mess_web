import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1 className="page-title">Welcome to Hostel Mess</h1>
      <p className="page-sub">Menus, announcements, polls & feedback — all in one place.</p>
      <div className="grid grid-2">
        <Link to="/menu" className="admin-link">📋 View Menu</Link>
        <Link to="/announcements" className="admin-link">📢 Announcements</Link>
        <Link to="/polls" className="admin-link">🗳️ Active Polls</Link>
        <Link to="/complaints" className="admin-link">💬 Submit Feedback</Link>
      </div>
    </div>
  );
}
