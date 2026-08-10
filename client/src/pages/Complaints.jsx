import { useState } from 'react';
import { api } from '../lib/api';

const CATEGORIES = ['Food quality', 'Hygiene', 'Timing', 'Staff', 'Other'];

export default function Complaints() {
  const [tab, setTab] = useState('submit');
  const [rollNo, setRollNo] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [trackCode, setTrackCode] = useState('');
  const [tracked, setTracked] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await api('/api/complaints', {
      method: 'POST',
      body: JSON.stringify({ rollNo, category, description }),
    });
    setSubmitted(data.trackingCode);
    setDescription('');
  }

  async function handleTrack(e) {
    e.preventDefault();
    const data = await api(`/api/complaints/track?rollNo=${encodeURIComponent(rollNo)}&code=${encodeURIComponent(trackCode)}`);
    setTracked(data);
  }

  return (
    <div>
      <h1 className="page-title">Feedback</h1>
      <p className="page-sub">Submit or track your feedback using roll number</p>

      <div className="tabs">
        <button type="button" className={tab === 'submit' ? 'active' : ''} onClick={() => setTab('submit')}>
          Submit
        </button>
        <button type="button" className={tab === 'track' ? 'active' : ''} onClick={() => setTab('track')}>
          Track
        </button>
      </div>

      {tab === 'submit' ? (
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="roll">Roll number</label>
            <input id="roll" placeholder="e.g. me1230948" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="cat">Category</label>
            <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="desc">Description</label>
            <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Submit feedback</button>
          {submitted && (
            <p className="alert" style={{ marginTop: '1rem', marginBottom: 0 }}>
              Thank you! Your tracking code: <strong>{submitted}</strong>
            </p>
          )}
        </form>
      ) : (
        <form className="card" onSubmit={handleTrack}>
          <div className="form-group">
            <label htmlFor="roll2">Roll number</label>
            <input id="roll2" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="code">Tracking code</label>
            <input id="code" value={trackCode} onChange={(e) => setTrackCode(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Track</button>
          {tracked === null && trackCode && (
            <p className="empty" style={{ marginTop: '1rem' }}>No feedback found.</p>
          )}
          {tracked && (
            <div className="card" style={{ marginTop: '1rem', background: 'var(--bg)' }}>
              <p><span className={`status status-${tracked.status}`}>{tracked.status.replace('_', ' ')}</span></p>
              <p style={{ marginTop: '0.5rem' }}><strong>{tracked.category}</strong></p>
              <p style={{ marginTop: '0.25rem' }}>{tracked.description}</p>
              {tracked.admin_reply && (
                <p style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--primary-soft)', borderRadius: 8 }}>
                  <strong>Reply:</strong> {tracked.admin_reply}
                </p>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
