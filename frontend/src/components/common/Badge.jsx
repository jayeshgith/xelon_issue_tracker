const Badge = ({ children, className = '', dot = false, dotClassName = 'bg-current' }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
  >
    {dot ? <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} aria-hidden="true" /> : null}
    {children}
  </span>
);

export default Badge;