import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft, Megaphone, Send, Trash2, Clock, Info, AlertOctagon } from 'lucide-react';

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api('/api/announcements')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await api('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({ title, body, priority }),
    });
    setTitle('');
    setBody('');
    setPriority('normal');
    load();
  }

  async function remove(id) {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    await api(`/api/announcements/${id}`, { method: 'DELETE' });
    load();
  }

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'urgent':
        return {
          card: 'border-l-4 border-l-red-500 bg-red-50/20 hover:bg-red-50/30 border border-slate-200',
          badge: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertOctagon className="h-5 w-5 text-red-600 animate-pulse" />
        };
      case 'important':
        return {
          card: 'border-l-4 border-l-amber-500 bg-amber-50/20 hover:bg-amber-50/30 border border-slate-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Info className="h-5 w-5 text-amber-600" />
        };
      default:
        return {
          card: 'border-l-4 border-l-brand-500 bg-white hover:border-brand-600 border border-slate-200',
          badge: 'bg-brand-50 text-brand-800 border-brand-200',
          icon: <Megaphone className="h-5 w-5 text-brand-600" />
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Navigation Breadcrumb */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Manage Announcements</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Post Form */}
        <div className="lg:col-span-1">
          <form className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5" onSubmit={create}>
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Create Announcement</h2>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Title</label>
              <input
                type="text"
                placeholder="e.g. Mess timings changed"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Notice Body</label>
              <textarea
                rows={5}
                placeholder="Describe details..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all resize-y min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Priority Level</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white appearance-none cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              Publish Notice
            </button>
          </form>
        </div>

        {/* Right Column: Active Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-brand-600" />
              Published Notices
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-2xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mb-2"></div>
              <p className="text-slate-400 text-xs">Loading notices...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-2xl px-4 text-center">
              <Megaphone className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm font-semibold">No Published Notices</p>
              <p className="text-slate-400 text-xs mt-0.5">Use the publisher form on the left to write announcements.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((a) => {
                const styles = getPriorityStyles(a.priority);
                return (
                  <div
                    key={a.id}
                    className={`p-5 rounded-2xl shadow-sm transition-all duration-300 flex justify-between gap-4 items-start ${styles.card}`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {styles.icon}
                        <h3 className="text-base font-bold text-slate-950">{a.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles.badge}`}>
                          {a.priority}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{a.body}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date(a.published_at).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(a.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      title="Delete notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
