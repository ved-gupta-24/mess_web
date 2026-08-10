import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('normal');

  function load() {
    api('/api/announcements').then(setItems).catch(console.error);
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
    load();
  }

  async function remove(id) {
    await api(`/api/announcements/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <Link to="/admin" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>← Dashboard</Link>
      <h1 className="page-title">Announcements</h1>

      <form className="card" onSubmit={create} style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <button type="submit" className="btn">Post announcement</button>
      </form>

      <div className="grid">
        {items.map((a) => (
          <div key={a.id} className="card">
            <h3>{a.title} <span className={`badge badge-${a.priority}`}>{a.priority}</span></h3>
            <p style={{ marginTop: '0.5rem' }}>{a.body}</p>
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => remove(a.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
