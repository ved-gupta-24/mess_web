import { useState, useEffect } from 'react';
import { api } from '../lib/api';

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
    await api(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ rollNo, optionIndex }),
    });
    setVoted((v) => ({ ...v, [pollId]: true }));
  }

  return (
    <div>
      <h1 className="page-title">Polls</h1>
      <p className="page-sub">Enter your roll number to vote</p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="roll">Roll number</label>
          <input
            id="roll"
            placeholder="e.g. cs1240384"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="empty">Loading polls…</div>
      ) : polls.length === 0 ? (
        <div className="empty">No active polls.</div>
      ) : (
        <div className="grid">
          {polls.map((poll) => (
            <div key={poll.id} className="card">
              <h3>{poll.question}</h3>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {poll.options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    className="btn btn-secondary"
                    style={{ justifyContent: 'space-between', textAlign: 'left' }}
                    onClick={() => vote(poll.id, i)}
                  >
                    <span>{opt}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {poll.voteCounts?.[i] ?? 0} votes
                    </span>
                  </button>
                ))}
              </div>
              {voted[poll.id] && (
                <p className="alert" style={{ marginTop: '1rem', marginBottom: 0 }}>Thanks for voting!</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
