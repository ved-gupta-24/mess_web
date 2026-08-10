import { useState } from 'react';
import { Coffee, Sun, Moon, UtensilsCrossed, Calendar, GlassWater } from 'lucide-react';
import menuData from '../data/menu.json';

const MEALS = ['breakfast', 'lunch', 'beverage', 'dinner'];

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
  const [mealFilter, setMealFilter] = useState('all');

  const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const weekDates = getWeekDates();
  const today = new Date();
  const day = today.getDay();
  const mondayToSundayIndex = (day + 6) % 7;

  const displayedDays = tab === 'today'
    ? [{ code: DAYS_OF_WEEK[mondayToSundayIndex], date: weekDates[mondayToSundayIndex] }]
    : DAYS_OF_WEEK.map((code, index) => ({ code, date: weekDates[index] }));

  const mealsToDisplay = mealFilter === 'all' ? MEALS : [mealFilter];

  const getMealIcon = (meal) => {
    switch (meal) {
      case 'breakfast': return <Coffee className="h-4 w-4" />;
      case 'lunch': return <Sun className="h-4 w-4" />;
      case 'beverage': return <GlassWater className="h-4 w-4" />;
      case 'dinner': return <Moon className="h-4 w-4" />;
      default: return <UtensilsCrossed className="h-4 w-4" />;
    }
  };

  const getMealColor = (meal) => {
    switch (meal) {
      case 'breakfast': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'lunch': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'beverage': return 'bg-sky-50 text-sky-700 ring-sky-600/20';
      case 'dinner': return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  const todayStr = today.toISOString().slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-brand-600" />
            Hostel Mess Menu
          </h1>
          <p className="text-slate-500 mt-1">Weekly scheduled menu loaded locally.</p>
        </div>

        {/* Today vs Weekly Filter */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-start md:self-center shadow-inner">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === 'today'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={() => setTab('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === 'week'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={() => setTab('week')}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Meals Sub-tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'all', label: 'All Meals', icon: <UtensilsCrossed className="h-4 w-4" /> },
          { key: 'breakfast', label: 'Breakfast', icon: <Coffee className="h-4 w-4" /> },
          { key: 'lunch', label: 'Lunch', icon: <Sun className="h-4 w-4" /> },
          { key: 'beverage', label: 'Beverage', icon: <GlassWater className="h-4 w-4" /> },
          { key: 'dinner', label: 'Dinner', icon: <Moon className="h-4 w-4" /> },
        ].map((m) => (
          <button
            key={m.key}
            type="button"
            className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 ${
              mealFilter === m.key
                ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
            onClick={() => setMealFilter(m.key)}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Schedule Listing */}
      <div className="grid grid-cols-1 gap-8">
        {displayedDays.map((dayObj) => {
          const isToday = dayObj.date === todayStr;
          const formattedDate = new Date(dayObj.date + 'T12:00:00').toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          });

          return (
            <div
              key={dayObj.code}
              className={`bg-white border rounded-2xl shadow-sm transition-all duration-300 ${
                isToday
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Date Header */}
              <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl ${isToday ? 'bg-brand-50/50' : 'bg-slate-50/50'}`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${isToday ? 'text-brand-600' : 'text-slate-500'}`} />
                  <span className="font-bold text-slate-900 text-lg">
                    {formattedDate} ({dayObj.code})
                  </span>
                </div>
                {isToday && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 border border-brand-200 uppercase tracking-wider">
                    Today
                  </span>
                )}
              </div>

              {/* Meals */}
              <div className="p-6 divide-y divide-slate-100">
                {mealsToDisplay.map((meal) => {
                  const mealText = menuData[dayObj.code]?.[meal] || '';
                  const items = mealText ? mealText.split(',').map((s) => s.trim()).filter(Boolean) : [];
                  const isMealAvailable = items.length > 0;

                  return (
                    <div
                      key={meal}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start gap-4 md:gap-8"
                    >
                      {/* Meal Tag */}
                      <div className="md:w-36 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset uppercase tracking-wider ${getMealColor(
                            meal
                          )}`}
                        >
                          {getMealIcon(meal)}
                          {meal}
                        </span>
                      </div>

                      {/* Meal Items */}
                      <div className="flex-1">
                        {isMealAvailable ? (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {items.map((item) => (
                              <li
                                key={item}
                                className="text-slate-700 text-sm flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                <span className="font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-400 text-sm italic flex items-center gap-1.5 py-1">
                            Not updated for this meal
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
