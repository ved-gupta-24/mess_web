import { useState, useEffect } from 'react';
import { api, isValidRoll } from '../lib/api';
import { Vote, User, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rollNo, setRollNo] = useState('');
  const [voted, setVoted] = useState({});

  useEffect(() => {
    api('/api/polls')
      .then(setPolls)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function vote(pollId, optionIndex) {
    if (!isValidRoll(rollNo)) return;
    try {
      await api(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ rollNo, optionIndex }),
      });
      setVoted((v) => ({ ...v, [pollId]: true }));
      // Reload polls to get updated vote counts
      api('/api/polls').then(setPolls).catch(console.error);
    } catch (err) {
      console.error(err);
    }
  }

  const isRollValid = isValidRoll(rollNo);

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Vote className="h-8 w-8 text-brand-600" />
          Active Polls
        </h1>
        <p className="text-slate-500 mt-1">Participate in opinion polls and shape the hostel menu.</p>
      </div>

      {/* Roll Number Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 max-w-md">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <User className="h-4 w-4 text-slate-400" />
          Student Verification
        </h2>
        <div className="space-y-2">
          <label htmlFor="roll" className="block text-xs font-semibold text-slate-500">
            Enter your Roll Number to enable voting
          </label>
          <input
            id="roll"
            type="text"
            placeholder="e.g. cs1240384"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border font-mono uppercase tracking-wider text-sm transition-all focus:outline-none focus:ring-2 ${
              rollNo.trim() === ''
                ? 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
                : isRollValid
                ? 'border-brand-500 focus:border-brand-600 focus:ring-brand-100 text-brand-700 font-semibold'
                : 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 text-rose-700'
            }`}
          />
          {rollNo.trim() !== '' && !isRollValid && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> Roll number format must be 2 letters followed by 7 digits (e.g. cs1240384).
            </p>
          )}
          {isRollValid && (
            <p className="text-xs text-brand-600 flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" /> Verified! Voting enabled.
            </p>
          )}
        </div>
      </div>

      {/* Polls Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading active polls...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm px-4 text-center">
          <Vote className="h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No Active Polls</h3>
          <p className="text-slate-500 mt-1 max-w-sm">There are no active opinion polls at the moment. Keep an eye out for updates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {polls.map((poll) => {
            const hasVoted = voted[poll.id];
            const totalVotes = poll.voteCounts ? poll.voteCounts.reduce((acc, count) => acc + count, 0) : 0;

            return (
              <div
                key={poll.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm transition-all hover:border-slate-300"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-6 leading-snug">{poll.question}</h3>
                
                <div className="flex flex-col gap-3">
                  {poll.options.map((opt, i) => {
                    const voteCount = poll.voteCounts?.[i] ?? 0;
                    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                    return (
                      <div key={opt} className="relative group">
                        {hasVoted ? (
                          // Result visual with progress bar style
                          <div className="w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden relative">
                            {/* Inner progress bar */}
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-brand-50 transition-all duration-1000 ease-out"
                              style={{ width: `${percentage}%`, zIndex: 0 }}
                            />
                            
                            <span className="font-semibold text-slate-800 text-sm relative z-10">{opt}</span>
                            <div className="flex items-center gap-3 relative z-10 text-xs sm:text-sm text-slate-500">
                              <span className="font-bold text-slate-900 bg-brand-100/85 px-2 py-0.5 rounded-lg">{percentage}%</span>
                              <span>({voteCount} {voteCount === 1 ? 'vote' : 'votes'})</span>
                            </div>
                          </div>
                        ) : (
                          // Interactive vote button
                          <button
                            type="button"
                            disabled={!isRollValid}
                            onClick={() => vote(poll.id, i)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                              isRollValid
                                ? 'border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50/10 cursor-pointer text-slate-700 hover:text-slate-900'
                                : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <span className="font-medium text-sm">{opt}</span>
                            <div className="flex items-center gap-2">
                              {isRollValid && (
                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transform group-hover:translate-x-0.5 transition-all" />
                              )}
                            </div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isRollValid && !hasVoted && (
                  <p className="text-xs text-slate-400 italic mt-4 flex items-center gap-1">
                    * Enter a verified roll number above to cast your vote.
                  </p>
                )}

                {hasVoted && (
                  <div className="mt-5 p-3 rounded-xl bg-brand-50 text-brand-800 border border-brand-100 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-brand-600 flex-shrink-0" />
                    <span>Thanks for voting! Your voice has been recorded.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
