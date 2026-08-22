const EmptyState = ({ title = 'No data found', description = 'There is nothing to show yet.', action = null }) => (
  <div className="panel flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

export default EmptyState;
