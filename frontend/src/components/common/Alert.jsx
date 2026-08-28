import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const variants = {
  error: {
    icon: AlertCircle,
    classes: 'border-rose-200 bg-rose-50 text-rose-800',
    iconTone: 'text-rose-500'
  },
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    iconTone: 'text-emerald-500'
  },
  info: {
    icon: Info,
    classes: 'border-sky-200 bg-sky-50 text-sky-800',
    iconTone: 'text-sky-500'
  }
};

const Alert = ({ variant = 'info', children }) => {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <p className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm ${config.classes}`} role={variant === 'error' ? 'alert' : 'status'}>
      <Icon size={16} className={`mt-0.5 shrink-0 ${config.iconTone}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
};

export default Alert;