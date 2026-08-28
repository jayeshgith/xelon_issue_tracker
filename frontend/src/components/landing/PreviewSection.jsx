import { LayoutDashboard, ListChecks, CheckCircle2, Clock3, Plus, TrendingUp } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const statTiles = [
  { label: 'Total Issues', value: '24', icon: ListChecks, tone: 'bg-brand-50 text-brand-700' },
  { label: 'In Progress', value: '7', icon: Clock3, tone: 'bg-amber-50 text-amber-700' },
  { label: 'Closed', value: '12', icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'High Priority', value: '4', icon: TrendingUp, tone: 'bg-rose-50 text-rose-700' }
];

const previewIssues = [
  { id: 'XEL-1042', title: 'Payment gateway fails after OTP', status: 'In Progress', statusTone: 'bg-amber-100 text-amber-700' },
  { id: 'XEL-1041', title: 'Login page slow on mobile network', status: 'Open', statusTone: 'bg-sky-100 text-sky-700' },
  { id: 'XEL-1038', title: 'Push notifications not delivered', status: 'Closed', statusTone: 'bg-emerald-100 text-emerald-700' }
];

const donutSegments = [
  { color: '#0ea5e9', label: 'Open', count: 5 },
  { color: '#f59e0b', label: 'In Progress', count: 7 },
  { color: '#16a34a', label: 'Closed', count: 12 }
];

const PreviewSection = () => {
  const total = donutSegments.reduce((sum, segment) => sum + segment.count, 0);
  let offset = 0;
  const background = donutSegments
    .map((segment) => {
      const start = (offset / total) * 100;
      offset += segment.count;
      const end = (offset / total) * 100;
      return `${segment.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <section className="bg-slate-50/70 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Product preview</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            See Xelon in action
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A glance at the dashboard experience waiting for your team behind the login.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-14">
          <div className="relative mx-auto max-w-4xl">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-brand-200/40 via-transparent to-sky-200/40 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-400" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="ml-4 hidden flex-1 rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-400 sm:block">
                  app.xelon.tracker/dashboard
                </span>
              </div>

              <div className="grid md:grid-cols-[12rem_1fr]">
                <div className="hidden border-r border-slate-200 bg-white p-4 md:block">
                  <p className="text-sm font-bold text-slate-950">Xelon</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-600">Issue Tracker</p>
                  <div className="mt-6 space-y-1.5">
                    <p className="flex items-center gap-2 rounded-lg bg-brand-50 px-2.5 py-2 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                      <LayoutDashboard size={14} aria-hidden="true" />
                      Dashboard
                    </p>
                    <p className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500">
                      <ListChecks size={14} aria-hidden="true" />
                      My Issues
                    </p>
                    <p className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500">
                      <Plus size={14} aria-hidden="true" />
                      Create Issue
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-950">Dashboard</p>
                      <p className="text-xs text-slate-500">Track your reported issues</p>
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 sm:inline-flex">
                      <LayoutDashboard size={13} aria-hidden="true" />
                      Live overview
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {statTiles.map((tile) => {
                      const Icon = tile.icon;

                      return (
                        <div key={tile.label} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-medium text-slate-500">{tile.label}</p>
                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${tile.tone}`}>
                              <Icon size={14} aria-hidden="true" />
                            </span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-slate-950">{tile.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Issue status</p>
                      <p className="text-xs text-slate-500">Where your workload stands</p>
                      <div className="mt-4 flex items-center justify-center">
                        <div
                          className="grid h-32 w-32 place-items-center rounded-full"
                          style={{ background: `conic-gradient(${background})` }}
                        >
                          <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                            <div className="text-center">
                              <p className="text-lg font-bold text-slate-950">{total}</p>
                              <p className="text-[10px] uppercase tracking-widest text-slate-400">issues</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-1.5">
                        {donutSegments.map((segment) => (
                          <div key={segment.label} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-slate-600">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} aria-hidden="true" />
                              {segment.label}
                            </span>
                            <span className="font-semibold text-slate-900">{segment.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Recent issues</p>
                      <p className="text-xs text-slate-500">Latest activity on your reports</p>
                      <div className="mt-3 divide-y divide-slate-100">
                        {previewIssues.map((issue) => (
                          <div key={issue.id} className="flex items-center justify-between gap-3 py-2.5">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800">{issue.id} — {issue.title}</p>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${issue.statusTone}`}>
                              {issue.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default PreviewSection;