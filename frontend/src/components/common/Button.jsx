const variants = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 disabled:bg-slate-300 disabled:shadow-none',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 disabled:bg-slate-100',
  danger: 'bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-700 disabled:bg-slate-300',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:text-slate-300'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  icon: 'h-9 w-9 p-0'
};

const Button = ({ children, className = '', variant = 'primary', size = 'md', type = 'button', ...props }) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;