import {
  ArrowDown,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Wrench,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const workflowSteps = [
  { icon: UserPlus, label: 'User reports issue', tone: 'bg-brand-50 text-brand-700 ring-brand-100' },
  { icon: ShieldCheck, label: 'Admin reviews', tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
  { icon: UserCheck, label: 'Developer assigned', tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
  { icon: Wrench, label: 'Developer resolves', tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
  { icon: CheckCircle2, label: 'Issue closed', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' }
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-pattern [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-8%] h-80 w-80 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <Sparkles size={14} aria-hidden="true" />
            Internal Issue Management Platform
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Track. Assign.
            <br />
            <span className="text-gradient">Resolve.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
            A centralized issue management platform that helps teams report, assign, track and
            resolve problems efficiently.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              Get Started
              <ArrowDown size={16} aria-hidden="true" className="rotate-[-90deg]" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Sign In
            </button>
          </div>
          <dl className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 lg:justify-start">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950">3</span> roles
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950">3</span> lifecycle stages
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950">1</span> platform
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-none">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-card backdrop-blur-sm sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Live issue workflow</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" aria-hidden="true" />
                Resolved
              </span>
            </div>
            <div className="mt-6 space-y-0">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === workflowSteps.length - 1;

                return (
                  <div key={step.label}>
                    <div className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50">
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${step.tone}`}>
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                        <p className="text-xs text-slate-400">Step {index + 1}</p>
                      </div>
                      {isLast ? (
                        <CheckCircle2 size={20} className="shrink-0 text-emerald-500" aria-hidden="true" />
                      ) : null}
                    </div>
                    {!isLast ? (
                      <div className="flex justify-center py-0.5" aria-hidden="true">
                        <ArrowDown size={16} className="text-slate-300" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-brand-50 to-sky-50 p-4 ring-1 ring-brand-100">
              <ClipboardCheck size={20} className="shrink-0 text-brand-600" aria-hidden="true" />
              <p className="text-sm text-slate-600">
                Every resolved issue keeps the reporter informed through live status and comments.
              </p>
            </div>
          </div>
          <span
            className="pointer-events-none absolute -right-6 -top-6 -z-10 h-40 w-40 animate-float rounded-full bg-gradient-to-br from-brand-200/60 to-sky-200/50 blur-2xl"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;