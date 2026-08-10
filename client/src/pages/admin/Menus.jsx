import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const MEALS = ['breakfast', 'lunch', 'dinner'];

export default function AdminMenus() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mealType, setMealType] = useState('breakfast');
  const [itemsText, setItemsText] = useState('');
  const [menus, setMenus] = useState([]);

  function load() {
    api(`/api/menus?date=${date}`).then(setMenus).catch(console.error);
  }

  useEffect(() => { load(); }, [date]);

  async function save(e) {
    e.preventDefault();
    const items = itemsText.split('\n').map((s) => s.trim()).filter(Boolean);
    await api('/api/menus', {
      method: 'POST',
      body: JSON.stringify({ date, meal_type: mealType, items }),
    });
    setItemsText('');
    load();
  }

  async function remove(id) {
    await api(`/api/menus/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <Link to="/admin" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>← Dashboard</Link>
      <h1 className="page-title">Manage Menus</h1>

      <form className="card" onSubmit={save} style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Meal</label>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            {MEALS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Items (one per line)</label>
          <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} placeholder="Rice&#10;Dal&#10;Roti" />
        </div>
        <button type="submit" className="btn">Save menu</button>
      </form>

      <div className="grid">
        {menus.map((m) => (
          <div key={m.id} className="card">
            <span className="meal-tag">{m.meal_type}</span>
            <ul className="items">{m.items.map((i) => <li key={i}>{i}</li>)}</ul>
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => remove(m.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
