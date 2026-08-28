export const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CLOSED', label: 'Closed' }
];

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

export const ROLE_LABELS = {
  user: 'User',
  admin: 'Admin',
  developer: 'Developer'
};

export const statusMeta = {
  OPEN: {
    label: 'Open',
    className: 'bg-sky-50 text-sky-700 ring-sky-200',
    dot: 'bg-sky-500'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500'
  },
  CLOSED: {
    label: 'Closed',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500'
  }
};

export const priorityMeta = {
  LOW: {
    label: 'Low',
    className: 'bg-slate-50 text-slate-700 ring-slate-200',
    dot: 'bg-slate-400'
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    dot: 'bg-indigo-500'
  },
  HIGH: {
    label: 'High',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
    dot: 'bg-rose-500'
  }
};