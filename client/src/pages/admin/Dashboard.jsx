import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-sub">Manage mess content</p>
      <div className="admin-grid">
        <Link to="/admin/menus" className="admin-link">📋 Menus</Link>
        <Link to="/admin/announcements" className="admin-link">📢 Announcements</Link>
        <Link to="/admin/polls" className="admin-link">🗳️ Polls</Link>
        <Link to="/admin/complaints" className="admin-link">💬 Feedback</Link>
      </div>
    </div>
  );
}
