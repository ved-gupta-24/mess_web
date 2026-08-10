import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/announcements')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Announcements</h1>
      <p className="page-sub">Updates from mess management</p>

      {loading ? (
        <div className="empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="empty">No announcements right now.</div>
      ) : (
        <div className="grid">
          {items.map((a) => (
            <div key={a.id} className="card">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3>{a.title}</h3>
                <span className={`badge badge-${a.priority}`}>{a.priority}</span>
              </div>
              <p>{a.body}</p>
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                {new Date(a.published_at).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
