import Button from './Button.jsx';

const ErrorState = ({ title = 'Unable to load data', message = 'Please try again.', onRetry }) => (
  <div className="panel px-6 py-8">
    <h2 className="text-base font-semibold text-rose-700">{title}</h2>
    <p className="mt-2 text-sm text-slate-600">{message}</p>
    {onRetry ? (
      <Button className="mt-4" variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    ) : null}
  </div>
);

export default ErrorState;
