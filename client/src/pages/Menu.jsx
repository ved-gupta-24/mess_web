import { useState, useEffect } from 'react';
import { api } from '../lib/api';

const MEALS = ['breakfast', 'lunch', 'dinner'];

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export default function Menu() {
  const [tab, setTab] = useState('today');
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const dates = tab === 'today' ? [today] : getWeekDates();
    const from = dates[0];
    const to = dates[dates.length - 1];

    api(`/api/menus?from=${from}&to=${to}`)
      .then(setMenus)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  const grouped = {};
  for (const m of menus) {
    grouped[m.date] = grouped[m.date] || {};
    grouped[m.date][m.meal_type] = m.items;
  }

  const dates = tab === 'today'
    ? [new Date().toISOString().slice(0, 10)]
    : getWeekDates();

  return (
    <div>
      <h1 className="page-title">Menu</h1>
      <p className="page-sub">Daily and weekly mess menu</p>

      <div className="tabs">
        <button type="button" className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>
          Today
        </button>
        <button type="button" className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>
          This Week
        </button>
      </div>

      {loading ? (
        <div className="empty">Loading menu…</div>
      ) : menus.length === 0 ? (
        <div className="empty">No menu posted yet.</div>
      ) : (
        <div className="grid">
          {dates.map((date) => (
            <div key={date} className="card">
              <h3>{new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'short',
              })}</h3>
              {MEALS.map((meal) => (
                <div key={meal} style={{ marginTop: '0.75rem' }}>
                  <span className="meal-tag">{meal}</span>
                  {grouped[date]?.[meal]?.length ? (
                    <ul className="items">
                      {grouped[date][meal].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Not updated</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
