import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState('');
  const [optionsText, setOptionsText] = useState('');

  function load() {
    api('/api/polls').then(setPolls).catch(console.error);
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    const options = optionsText.split('\n').map((s) => s.trim()).filter(Boolean);
    await api('/api/polls', {
      method: 'POST',
      body: JSON.stringify({ question, options }),
    });
    setQuestion('');
    setOptionsText('');
    load();
  }

  async function close(id) {
    await api(`/api/polls/${id}/close`, { method: 'PATCH' });
    load();
  }

  return (
    <div>
      <Link to="/admin" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>← Dashboard</Link>
      <h1 className="page-title">Polls</h1>

      <form className="card" onSubmit={create} style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Question</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Options (one per line, min 2)</label>
          <textarea value={optionsText} onChange={(e) => setOptionsText(e.target.value)} placeholder="Option A&#10;Option B" />
        </div>
        <button type="submit" className="btn">Create poll</button>
      </form>

      <div className="grid">
        {polls.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.question}</h3>
            <ul className="items" style={{ marginTop: '0.5rem' }}>
              {p.options.map((opt, i) => (
                <li key={opt}>{opt} — {p.voteCounts?.[i] ?? 0} votes</li>
              ))}
            </ul>
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => close(p.id)}>
              Close poll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
