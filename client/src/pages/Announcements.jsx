import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Megaphone, AlertOctagon, Info, Clock } from 'lucide-react';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/announcements')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'urgent':
        return {
          card: 'border-l-4 border-l-red-500 bg-red-50/40 hover:bg-red-50/60 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-slate-200 dark:border-slate-800',
          badge: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
          icon: <AlertOctagon className="h-5 w-5 text-red-600 animate-pulse" />
        };
      case 'important':
        return {
          card: 'border-l-4 border-l-amber-500 bg-amber-50/40 hover:bg-amber-50/60 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 border border-slate-200 dark:border-slate-800',
          badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: <Info className="h-5 w-5 text-amber-600" />
        };
      default:
        return {
          card: 'border-l-4 border-l-brand-500 bg-white dark:bg-slate-900 hover:border-brand-600 border border-slate-200 dark:border-slate-800',
          badge: 'bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-300 border-brand-200 dark:border-brand-800',
          icon: <Megaphone className="h-5 w-5 text-brand-600" />
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Megaphone className="h-8 w-8 text-brand-600" />
          Announcements
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Updates and notifications from mess management.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-slate-500 dark:text-slate-450 font-medium">Loading announcements...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center px-4">
          <Megaphone className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Announcements</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Everything is running smoothly! Check back later for updates.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((a) => {
            const styles = getPriorityStyles(a.priority);
            return (
              <div
                key={a.id}
                className={`p-6 rounded-2xl transition-all duration-300 shadow-sm ${styles.card}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {styles.icon}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{a.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles.badge}`}>
                    {a.priority}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{a.body}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-4">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {new Date(a.published_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
