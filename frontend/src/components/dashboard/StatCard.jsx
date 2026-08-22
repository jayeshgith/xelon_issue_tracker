const StatCard = ({ title, value, accent = 'teal', icon: Icon }) => {
  const accentClasses = {
    teal: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value ?? 0}</p>
        </div>
        {Icon ? (
          <span className={`rounded-md p-2 ${accentClasses[accent] || accentClasses.teal}`}>
            <Icon size={20} />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;
