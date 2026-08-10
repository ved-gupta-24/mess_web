import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const STATUSES = ['submitted', 'in_review', 'resolved', 'closed'];

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [replyDraft, setReplyDraft] = useState({});

  function load() {
    api('/api/complaints/admin').then(setItems).catch(console.error);
  }

  useEffect(() => { load(); }, []);

  async function update(id, status, admin_reply) {
    await api(`/api/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_reply }),
    });
    load();
  }

  return (
    <div>
      <Link to="/admin" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>← Dashboard</Link>
      <h1 className="page-title">Feedback Inbox</h1>

      {items.length === 0 ? (
        <div className="empty">No feedback yet.</div>
      ) : (
        <div className="grid">
          {items.map((c) => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className={`status status-${c.status}`}>{c.status.replace('_', ' ')}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{c.roll_no} · {c.tracking_code}</span>
              </div>
              <p style={{ marginTop: '0.5rem' }}><strong>{c.category}</strong></p>
              <p>{c.description}</p>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Status</label>
                <select
                  value={c.status}
                  onChange={(e) => update(c.id, e.target.value, c.admin_reply)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Reply to student</label>
                <textarea
                  value={replyDraft[c.id] ?? c.admin_reply ?? ''}
                  onChange={(e) => setReplyDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                />
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => update(c.id, c.status, replyDraft[c.id] ?? c.admin_reply)}
              >
                Save reply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
