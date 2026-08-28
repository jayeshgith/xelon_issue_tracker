import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = 'There is nothing to show yet.', action = null }) => (
  <div className="panel flex min-h-40 flex-col items-center justify-center border-dashed px-6 py-10 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
      <Inbox size={22} aria-hidden="true" />
    </span>
    <h2 className="mt-4 text-base font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

export default EmptyState;