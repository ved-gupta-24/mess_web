import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft, Calendar, Save, Trash2 } from 'lucide-react';

const MEALS = ['breakfast', 'lunch', 'dinner'];

export default function AdminMenus() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mealType, setMealType] = useState('breakfast');
  const [itemsText, setItemsText] = useState('');
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api(`/api/menus?date=${date}`)
      .then(setMenus)
      .catch(console.error)
      .finally(() => setLoading(false));
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
    if (!window.confirm('Are you sure you want to delete this menu?')) return;
    await api(`/api/menus/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Navigation Breadcrumb */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Manage Menus</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <form className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5" onSubmit={save}>
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Schedule Meal</h2>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Meal Session</label>
              <div className="relative">
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white appearance-none cursor-pointer"
                >
                  {MEALS.map((m) => (
                    <option key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
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
              <label className="block text-sm font-semibold text-slate-700">Menu Items (one per line)</label>
              <textarea
                rows={5}
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                placeholder="Masala Dosa&#10;Sambar&#10;Coconut Chutney"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all resize-none min-h-[120px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              Save Meal Menu
            </button>
          </form>
        </div>

        {/* Right Column: Menu Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-600" />
              Overview for {new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-2xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mb-2"></div>
              <p className="text-slate-400 text-xs">Loading menus...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-2xl px-4 text-center">
              <Calendar className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm font-semibold">No Meals Scheduled</p>
              <p className="text-slate-400 text-xs mt-0.5">Use the scheduler form on the left to post menus for this date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menus.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
                        m.meal_type === 'breakfast'
                          ? 'bg-amber-100 text-amber-800'
                          : m.meal_type === 'lunch'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {m.meal_type}
                    </span>
                    <ul className="space-y-1.5">
                      {m.items.map((i) => (
                        <li key={i} className="text-slate-700 text-sm flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="mt-6 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/85 rounded-xl transition-all w-fit cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Meal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
