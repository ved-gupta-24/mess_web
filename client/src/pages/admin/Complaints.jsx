import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft, Inbox, MessageSquare, Save, Clock, CornerDownRight } from 'lucide-react';

const STATUSES = ['submitted', 'in_review', 'resolved', 'closed'];

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [replyDraft, setReplyDraft] = useState({});
  const [filterTab, setFilterTab] = useState('all');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api('/api/complaints/admin')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function update(id, status, admin_reply) {
    try {
      await api(`/api/complaints/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, admin_reply }),
      });
      alert('Feedback updated successfully!');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to update feedback status.');
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'in_review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterTab === 'pending') return item.status === 'submitted' || item.status === 'in_review';
    if (filterTab === 'resolved') return item.status === 'resolved';
    if (filterTab === 'closed') return item.status === 'closed';
    return true;
  });

  const getCounts = (tab) => {
    if (tab === 'all') return items.length;
    if (tab === 'pending') return items.filter(i => i.status === 'submitted' || i.status === 'in_review').length;
    if (tab === 'resolved') return items.filter(i => i.status === 'resolved').length;
    if (tab === 'closed') return items.filter(i => i.status === 'closed').length;
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Navigation Breadcrumb */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Feedback Inbox</h1>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-full mb-8 shadow-inner flex-wrap">
        {[
          { key: 'all', label: 'All Feedback' },
          { key: 'pending', label: 'Pending / In Review' },
          { key: 'resolved', label: 'Resolved' },
          { key: 'closed', label: 'Closed' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              filterTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={() => setFilterTab(tab.key)}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono ${
              filterTab === tab.key ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-500'
            }`}>
              {getCounts(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Inbox Items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading inbox feedbacks...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-center px-4">
          <Inbox className="h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No Feedback Found</h3>
          <p className="text-slate-500 mt-1 max-w-sm">No items in this category yet. You are completely caught up!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 transition-all hover:border-slate-300"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-650">
                    {c.category}
                  </span>
                </div>
                <div className="flex flex-col items-end text-xs font-semibold text-slate-400 gap-1 font-mono">
                  <span>ROLL: {c.roll_no}</span>
                  <span>CODE: {c.tracking_code}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-2">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{c.description}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Submitted: {new Date(c.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Office Action</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500">Update Status</label>
                    <div className="relative">
                      <select
                        value={c.status}
                        onChange={(e) => update(c.id, e.target.value, c.admin_reply)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-100 transition-all bg-white appearance-none cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500">Reply to Student</label>
                    <textarea
                      rows={2}
                      placeholder="Write response draft..."
                      value={replyDraft[c.id] ?? c.admin_reply ?? ''}
                      onChange={(e) => setReplyDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-100 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => update(c.id, c.status, replyDraft[c.id] ?? c.admin_reply)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-1"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Reply & Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
