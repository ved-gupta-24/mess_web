import { Link } from 'react-router-dom';
import { CalendarRange, Megaphone, Vote, MessageSquarePlus, ArrowRight } from 'lucide-react';

export default function Home() {
  const cards = [
    {
      to: '/menu',
      title: 'View Mess Menu',
      description: 'Check today’s meal options, recipes, and weekly catering schedules.',
      icon: CalendarRange,
      color: 'hover:border-emerald-400 hover:shadow-emerald-100/50',
      iconBg: 'bg-emerald-100 text-emerald-700'
    },
    {
      to: '/announcements',
      title: 'Announcements',
      description: 'Stay updated on timings, changes, and notices from mess management.',
      icon: Megaphone,
      color: 'hover:border-sky-400 hover:shadow-sky-100/50',
      iconBg: 'bg-sky-100 text-sky-700'
    },
    {
      to: '/polls',
      title: 'Active Polls',
      description: 'Vote on menu additions, preferences, and voice your choice.',
      icon: Vote,
      color: 'hover:border-indigo-400 hover:shadow-indigo-100/50',
      iconBg: 'bg-indigo-100 text-indigo-700'
    },
    {
      to: '/complaints',
      title: 'Submit Feedback',
      description: 'File complaints or request changes regarding hygiene, quality, and service.',
      icon: MessageSquarePlus,
      color: 'hover:border-amber-400 hover:shadow-amber-100/50',
      iconBg: 'bg-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="py-6 md:py-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Welcome to the <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">Zanskar Mess Portal</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Your unified dashboard for menus, notices, opinions, and feedback. Designed for students, managed by mess committee.
        </p>
      </div>

      {/* Grid Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className={`flex flex-col justify-between p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${card.color}`}
            >
              <div>
                <div className={`p-3 rounded-xl w-fit ${card.iconBg} mb-5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{card.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{card.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-500 mt-auto group">
                Explore Portal
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
