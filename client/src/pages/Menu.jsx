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
  const todayStr = today.toISOString().slice(0, 10);

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
      case 'breakfast': return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-500/20';
      case 'lunch': return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-emerald-600/20 dark:ring-emerald-500/20';
      case 'beverage': return 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 ring-sky-600/20 dark:ring-sky-500/20';
      case 'dinner': return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-indigo-600/20 dark:ring-indigo-500/20';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-600/20';
    }
  };

  function renderMealItems(mealText) {
    if (!mealText) {
      return (
        <span className="text-slate-400 dark:text-slate-500 text-xs italic py-1 block">
          Not scheduled
        </span>
      );
    }
    const items = mealText.split(',').map((s) => s.trim()).filter(Boolean);
    return (
      <ul className="space-y-1 py-1">
        {items.map((item) => (
          <li
            key={item}
            className="text-slate-700 dark:text-slate-300 text-xs flex items-start gap-1.5 py-0.5"
          >
            <span className="h-1 w-1 rounded-full bg-brand-500 dark:bg-brand-400 mt-1.5 flex-shrink-0" />
            <span className="leading-relaxed font-medium">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Dynamic table columns for weekly view
  const columns = [
    { key: 'day', label: 'Day / Date' },
    ...(mealFilter === 'all'
      ? [
          { key: 'breakfast', label: 'Breakfast', icon: <Coffee className="h-3.5 w-3.5 mr-1 text-amber-500" /> },
          { key: 'lunch', label: 'Lunch', icon: <Sun className="h-3.5 w-3.5 mr-1 text-emerald-500" /> },
          { key: 'beverage', label: 'Evening Beverage', icon: <GlassWater className="h-3.5 w-3.5 mr-1 text-sky-500" /> },
          { key: 'dinner', label: 'Dinner', icon: <Moon className="h-3.5 w-3.5 mr-1 text-indigo-500" /> }
        ]
      : [
          { 
            key: mealFilter, 
            label: mealFilter === 'beverage' ? 'Evening Beverage' : mealFilter.charAt(0).toUpperCase() + mealFilter.slice(1),
            icon: getMealIcon(mealFilter)
          }
        ])
  ];

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-brand-600 dark:text-brand-500" />
            Zanskar Mess Menu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Weekly scheduled menu loaded locally.</p>
        </div>

        {/* Today vs Weekly Filter */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit self-start md:self-center shadow-inner border border-slate-200/20">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'today'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            onClick={() => setTab('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'week'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
            className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
              mealFilter === m.key
                ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            onClick={() => setMealFilter(m.key)}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Desktop Weekly Table View */}
      {tab === 'week' && (
        <div className="hidden md:block overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-slate-900 transition-colors mb-8">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    <span className="inline-flex items-center">
                      {col.icon}
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 transition-colors">
              {DAYS_OF_WEEK.map((dayCode, idx) => {
                const isToday = weekDates[idx] === todayStr;
                const formattedDate = new Date(weekDates[idx] + 'T12:00:00').toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                });
                const weekdayName = new Date(weekDates[idx] + 'T12:00:00').toLocaleDateString('en-IN', {
                  weekday: 'short',
                });

                return (
                  <tr
                    key={dayCode}
                    className={`transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-850/20 ${
                      isToday ? 'bg-brand-50/15 dark:bg-brand-950/10' : ''
                    }`}
                  >
                    {/* Day Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white align-top">
                      <div className="flex flex-col">
                        <span>{weekdayName} ({dayCode})</span>
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 mt-0.5">
                          {formattedDate}
                        </span>
                        {isToday && (
                          <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-900/50 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800 uppercase tracking-wider w-fit">
                            Today
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Meal Cells */}
                    {mealFilter === 'all' ? (
                      <>
                        <td className="px-6 py-4 text-sm align-top min-w-[150px]">
                          {renderMealItems(menuData[dayCode]?.breakfast)}
                        </td>
                        <td className="px-6 py-4 text-sm align-top min-w-[150px]">
                          {renderMealItems(menuData[dayCode]?.lunch)}
                        </td>
                        <td className="px-6 py-4 text-sm align-top min-w-[120px]">
                          {renderMealItems(menuData[dayCode]?.beverage)}
                        </td>
                        <td className="px-6 py-4 text-sm align-top min-w-[150px]">
                          {renderMealItems(menuData[dayCode]?.dinner)}
                        </td>
                      </>
                    ) : (
                      <td className="px-6 py-4 text-sm align-top">
                        {renderMealItems(menuData[dayCode]?.[mealFilter])}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Card-based View (Mobile for Weekly, Both for Today) */}
      <div className={tab === 'week' ? 'md:hidden space-y-6' : 'space-y-6'}>
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
              className={`bg-white dark:bg-slate-900 border rounded-2xl shadow-sm transition-all duration-300 ${
                isToday
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Date Header */}
              <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-2xl ${isToday ? 'bg-brand-50/50 dark:bg-brand-950/20' : 'bg-slate-50/50 dark:bg-slate-900/50'}`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${isToday ? 'text-brand-600 dark:text-brand-500' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="font-bold text-slate-900 dark:text-white text-lg">
                    {formattedDate} ({dayObj.code})
                  </span>
                </div>
                {isToday && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-900/50 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800 uppercase tracking-wider">
                    Today
                  </span>
                )}
              </div>

              {/* Meals */}
              <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800">
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
                                className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2 py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 dark:bg-brand-450 flex-shrink-0" />
                                <span className="font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-400 dark:text-slate-500 text-sm italic flex items-center gap-1.5 py-1">
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

      {/* Footer disclaimer for asterisks */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 justify-center">
        <span className="inline-block animate-pulse h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span>* Asterisks mean liable to admin permissions</span>
      </div>
    </div>
  );
}
