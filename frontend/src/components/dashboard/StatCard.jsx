const StatCard = ({ title, value, accent = 'teal', icon: Icon }) => {
  const accentClasses = {
    teal: 'bg-brand-50 text-brand-700 ring-brand-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200'
  };

  return (
    <div className="panel group p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-slate-950">{value ?? 0}</p>
        </div>
        {Icon ? (
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset transition group-hover:scale-105 ${accentClasses[accent] || accentClasses.teal}`}>
            <Icon size={19} aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;