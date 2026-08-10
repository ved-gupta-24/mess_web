import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft, Vote, Plus, PowerOff, Award } from 'lucide-react';

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState('');
  const [optionsText, setOptionsText] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api('/api/polls')
      .then(setPolls)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    const options = optionsText.split('\n').map((s) => s.trim()).filter(Boolean);
    if (options.length < 2) {
      alert('Please enter at least 2 options.');
      return;
    }
    await api('/api/polls', {
      method: 'POST',
      body: JSON.stringify({ question, options }),
    });
    setQuestion('');
    setOptionsText('');
    load();
  }

  async function close(id) {
    if (!window.confirm('Are you sure you want to close this poll?')) return;
    await api(`/api/polls/${id}/close`, { method: 'PATCH' });
    load();
  }

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

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Manage Polls</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <form className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5" onSubmit={create}>
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Create New Poll</h2>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Question</label>
              <input
                type="text"
                placeholder="e.g. Add Kheer on Sunday Dinner?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Options (one per line, min 2)</label>
              <textarea
                rows={5}
                value={optionsText}
                placeholder="Option A&#10;Option B"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all resize-y min-h-[120px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Launch Poll
            </button>
          </form>
        </div>

        {/* Right Column: Active Polls list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Vote className="h-5 w-5 text-brand-600" />
              Active Polls Feed
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-2xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mb-2"></div>
              <p className="text-slate-400 text-xs">Loading polls...</p>
            </div>
          ) : polls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-2xl px-4 text-center">
              <Vote className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm font-semibold">No Active Polls</p>
              <p className="text-slate-400 text-xs mt-0.5">Use the launcher form on the left to start a new student poll.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {polls.map((p) => {
                const totalVotes = p.voteCounts ? p.voteCounts.reduce((acc, count) => acc + count, 0) : 0;

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-base font-bold text-slate-950 leading-snug">{p.question}</h3>
                      <span className="bg-brand-50 border border-brand-200 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                        Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      {p.options.map((opt, i) => {
                        const voteCount = p.voteCounts?.[i] ?? 0;
                        const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                        return (
                          <div key={opt} className="relative group">
                            <div className="w-full border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 flex items-center justify-between gap-2 overflow-hidden relative">
                              <div
                                className="absolute left-0 top-0 bottom-0 bg-brand-50 transition-all duration-1000"
                                style={{ width: `${percentage}%`, zIndex: 0 }}
                              />
                              <span className="text-xs font-semibold text-slate-700 relative z-10">{opt}</span>
                              <div className="flex items-center gap-2 relative z-10 text-xs text-slate-500">
                                <span className="font-bold text-slate-800 bg-brand-100/80 px-2 py-0.5 rounded-lg">{percentage}%</span>
                                <span>({voteCount} votes)</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Award className="h-4 w-4 text-slate-400" />
                        Total Votes: {totalVotes}
                      </span>

                      <button
                        type="button"
                        onClick={() => close(p.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-100 hover:border-amber-200 rounded-xl transition-all cursor-pointer"
                      >
                        <PowerOff className="h-3.5 w-3.5" />
                        Close Poll
                      </button>
                    </div>
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
