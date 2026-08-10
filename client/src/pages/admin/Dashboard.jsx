import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  Shield,
  Calendar,
  Vote,
  MessageSquare,
  Megaphone,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    menuMeals: [],
    activePollsCount: 0,
    pendingFeedbackCount: 0,
    recentFeedback: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    
    Promise.all([
      api(`/api/menus?date=${todayStr}`).catch(() => []),
      api('/api/polls').catch(() => []),
      api('/api/complaints/admin').catch(() => []),
    ])
      .then(([menus, polls, complaints]) => {
        const pending = complaints.filter(
          (c) => c.status === 'submitted' || c.status === 'in_review'
        );

        setStats({
          menuMeals: menus.map((m) => m.meal_type),
          activePollsCount: polls.length,
          pendingFeedbackCount: pending.length,
          recentFeedback: complaints.slice(0, 3),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const navLinks = [
    {
      to: '/admin/menus',
      title: 'Manage Menus',
      description: 'Add or modify today\'s and weekly hostel dining schedules.',
      icon: Calendar,
      color: 'border-emerald-100 hover:border-emerald-400 bg-emerald-50/20 text-emerald-800'
    },
    {
      to: '/admin/announcements',
      title: 'Announcements',
      description: 'Post and delete notices regarding timings, events, and food.',
      icon: Megaphone,
      color: 'border-sky-100 hover:border-sky-400 bg-sky-50/20 text-sky-800'
    },
    {
      to: '/admin/polls',
      title: 'Polls & Audits',
      description: 'Launch student opinion polls and review voting statistics.',
      icon: Vote,
      color: 'border-indigo-100 hover:border-indigo-400 bg-indigo-50/20 text-indigo-800'
    },
    {
      to: '/admin/complaints',
      title: 'Feedback Inbox',
      description: 'Review incoming feedback complaints and reply to students.',
      icon: MessageSquare,
      color: 'border-amber-100 hover:border-amber-400 bg-amber-50/20 text-amber-800'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'in_review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Welcome Banner */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-5 mb-8">
        <div className="p-2 bg-brand-100 text-brand-700 rounded-xl">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-0.5">Control center for managing the Hostel Mess Portal</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading administrative metrics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget 1: Today's Menu */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Today's Menu Status</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  {stats.menuMeals.length === 3 ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                  <span className="text-lg font-extrabold text-slate-800">
                    {stats.menuMeals.length}/3 Meals Posted
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  {['breakfast', 'lunch', 'dinner'].map((meal) => {
                    const exists = stats.menuMeals.includes(meal);
                    return (
                      <span
                        key={meal}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          exists
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {meal.slice(0, 5)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Widget 2: Active Polls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Polls</h3>
                <div className="text-3xl font-extrabold text-slate-800 mt-1">
                  {stats.activePollsCount}
                </div>
                <p className="text-slate-500 text-xs mt-2">Open student polls collecting votes</p>
              </div>
            </div>

            {/* Widget 3: Pending Feedback */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Pending Feedback</h3>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-extrabold text-slate-800 mt-1">
                    {stats.pendingFeedbackCount}
                  </div>
                  {stats.pendingFeedbackCount > 0 && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-2">Feedbacks awaiting review or reply</p>
              </div>
            </div>
          </div>

          {/* Quick Nav Section */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Management Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex flex-col bg-white ${link.color}`}
                  >
                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 w-fit mb-4">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{link.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">{link.description}</p>
                    <div className="text-xs font-bold flex items-center gap-1 mt-auto">
                      Open Module
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Feedback Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-600" />
                Recent Feedback Submissions
              </h2>
              <Link to="/admin/complaints" className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1">
                View Inbox
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {stats.recentFeedback.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No complaints or feedbacks submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentFeedback.map((c) => (
                  <div key={c.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-slate-400">{c.roll_no}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-slate-600">{c.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm line-clamp-1">{c.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-shrink-0 self-end sm:self-center">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(c.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
