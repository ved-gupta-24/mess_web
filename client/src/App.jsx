import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Announcements from './pages/Announcements';
import Polls from './pages/Polls';
import Complaints from './pages/Complaints';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMenus from './pages/admin/Menus';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminPolls from './pages/admin/Polls';
import AdminComplaints from './pages/admin/Complaints';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="empty">Loading…</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="polls" element={<Polls />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/menus" element={<AdminRoute><AdminMenus /></AdminRoute>} />
        <Route path="admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
        <Route path="admin/polls" element={<AdminRoute><AdminPolls /></AdminRoute>} />
        <Route path="admin/complaints" element={<AdminRoute><AdminComplaints /></AdminRoute>} />
      </Route>
    </Routes>
  );
}
