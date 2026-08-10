import { useState } from 'react';
import { api, isValidRoll } from '../lib/api';
import { MessageSquare, PenTool, Search, Send, CheckCircle2, CornerDownRight, AlertCircle, ShieldAlert } from 'lucide-react';

const CATEGORIES = ['Food quality', 'Hygiene', 'Timing', 'Staff', 'Other'];

export default function Complaints() {
  const [tab, setTab] = useState('submit');
  const [rollNo, setRollNo] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [trackCode, setTrackCode] = useState('');
  const [tracked, setTracked] = useState(null);
  const [error, setError] = useState('');
  const [trackError, setTrackError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitted(null);

    if (!isValidRoll(rollNo)) {
      setError('Please enter a valid roll number.');
      return;
    }

    try {
      const data = await api('/api/complaints', {
        method: 'POST',
        body: JSON.stringify({ rollNo, category, description }),
      });
      setSubmitted(data.trackingCode);
      setDescription('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    }
  }

  async function handleTrack(e) {
    e.preventDefault();
    setTrackError('');
    setTracked(null);

    if (!isValidRoll(rollNo)) {
      setTrackError('Please enter a valid roll number.');
      return;
    }

    try {
      const data = await api(`/api/complaints/track?rollNo=${encodeURIComponent(rollNo)}&code=${encodeURIComponent(trackCode)}`);
      if (!data) {
        setTracked(false); // Indicates search complete but no results found
      } else {
        setTracked(data);
      }
    } catch (err) {
      setTrackError('Failed to fetch tracking details.');
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-850';
      case 'in_review':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-850';
      case 'resolved':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-850';
      case 'closed':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
      default:
        return 'bg-slate-50 dark:bg-slate-855 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    }
  };

  const isRollValid = rollNo === '' ? true : isValidRoll(rollNo);

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-brand-600" />
          Feedback Portal
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Submit feedback, report issues, or track complaints status.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full mb-8 shadow-inner border border-slate-200/20">
        <button
          type="button"
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            tab === 'submit'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          onClick={() => {
            setTab('submit');
            setError('');
          }}
        >
          <div className="flex items-center justify-center gap-1.5">
            <PenTool className="h-4 w-4" />
            Submit Feedback
          </div>
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            tab === 'track'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          onClick={() => {
            setTab('track');
            setTrackError('');
          }}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Search className="h-4 w-4" />
            Track Status
          </div>
        </button>
      </div>

      {tab === 'submit' ? (
        /* Submit Form */
        <form className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 border border-rose-100 dark:border-rose-900/50 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Feedback submitted successfully!</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your tracking code is:{' '}
                <span className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-250 font-extrabold uppercase tracking-wider text-sm select-all">
                  {submitted}
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 pl-7">Save this code to track response updates.</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="roll" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Roll number
            </label>
            <input
              id="roll"
              placeholder="e.g. me1230948"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border font-mono uppercase tracking-wider text-sm transition-all focus:outline-none focus:ring-2 ${
                rollNo.trim() === ''
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-slate-400 dark:focus:border-slate-700 focus:ring-slate-100 dark:focus:ring-slate-900'
                  : isRollValid
                  ? 'border-brand-500 focus:border-brand-600 focus:ring-brand-100 dark:focus:ring-brand-950 text-brand-700 dark:text-brand-300 bg-white dark:bg-slate-950 font-semibold'
                  : 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950 text-rose-700 dark:text-rose-450 bg-white dark:bg-slate-950'
              }`}
              required
            />
            {rollNo.trim() !== '' && !isRollValid && (
              <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Roll number format must be 2 letters followed by 7 digits.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cat" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <div className="relative">
              <select
                id="cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white dark:bg-slate-950 appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="dark:bg-slate-900">
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="desc" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="desc"
              rows={4}
              placeholder="Describe your feedback or issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white dark:bg-slate-950 resize-y min-h-[120px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isRollValid}
            className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              isRollValid
                ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer active:scale-[0.98]'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
            Submit Feedback
          </button>
        </form>
      ) : (
        /* Track Form */
        <div className="space-y-6">
          <form className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5" onSubmit={handleTrack}>
            {trackError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 border border-rose-100 dark:border-rose-900/50 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="roll2" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Roll number
                </label>
                <input
                  id="roll2"
                  placeholder="e.g. me1230948"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border font-mono uppercase tracking-wider text-sm transition-all focus:outline-none focus:ring-2 ${
                    rollNo.trim() === ''
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-slate-400 dark:focus:border-slate-700 focus:ring-slate-100 dark:focus:ring-slate-900'
                      : isRollValid
                      ? 'border-brand-500 focus:border-brand-600 focus:ring-brand-100 dark:focus:ring-brand-950 text-brand-700 dark:text-brand-300 bg-white dark:bg-slate-950 font-semibold'
                      : 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950 text-rose-700 dark:text-rose-400 bg-white dark:bg-slate-950'
                  }`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tracking code
                </label>
                <input
                  id="code"
                  placeholder="Enter 6-char code"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isRollValid}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isRollValid
                  ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              <Search className="h-4 w-4" />
              Track Status
            </button>
          </form>

          {/* Track Results */}
          {tracked === false && (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm px-4 text-center">
              <ShieldAlert className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Feedback Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xs">Double check your roll number and tracking code. Make sure they match exactly.</p>
            </div>
          )}

          {tracked && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">STATUS:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(tracked.status)}`}>
                    {tracked.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 dark:text-slate-555 select-all">
                  CODE: {trackCode.toUpperCase()}
                </div>
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
                  {tracked.category}
                </span>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{tracked.description}</p>
              </div>

              {/* Admin Reply timeline widget */}
              {tracked.admin_reply && (
                <div className="mt-6 p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/50 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider mb-2">
                    <CornerDownRight className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    <span>Response from Mess Office</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm pl-5 leading-relaxed whitespace-pre-wrap">{tracked.admin_reply}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
