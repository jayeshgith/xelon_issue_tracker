const LoadingState = ({ label = 'Loading...', fullScreen = false }) => (
  <div className={`grid place-items-center ${fullScreen ? 'min-h-screen' : 'min-h-40'}`}>
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-brand-200 border-t-brand-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  </div>
);

export default LoadingState;