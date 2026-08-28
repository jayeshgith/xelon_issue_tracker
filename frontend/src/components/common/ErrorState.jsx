import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

const ErrorState = ({ title = 'Unable to load data', message = 'Please try again.', onRetry }) => (
  <div className="panel px-6 py-8">
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
        <AlertTriangle size={20} aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-rose-700">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
      </div>
    </div>
    {onRetry ? (
      <Button className="mt-4" variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    ) : null}
  </div>
);

export default ErrorState;