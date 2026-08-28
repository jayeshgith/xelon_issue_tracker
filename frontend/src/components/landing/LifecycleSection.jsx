import { ArrowDown, Clock3, Inbox, PackageCheck } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const stages = [
  {
    icon: Inbox,
    label: 'OPEN',
    title: 'Reported & waiting',
    description: 'Issue has been reported and is waiting for work.',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    iconTone: 'bg-sky-50 text-sky-600 ring-sky-100'
  },
  {
    icon: Clock3,
    label: 'IN PROGRESS',
    title: 'Being worked on',
    description: 'A developer is actively working on the issue.',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    iconTone: 'bg-amber-50 text-amber-600 ring-amber-100'
  },
  {
    icon: PackageCheck,
    label: 'CLOSED',
    title: 'Resolved',
    description: 'The issue has been resolved.',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    iconTone: 'bg-emerald-50 text-emerald-600 ring-emerald-100'
  }
];

const LifecycleSection = () => (
  <section className="bg-slate-900 py-20 text-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Transparent status</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">The issue lifecycle</h2>
        <p className="mt-4 text-lg text-slate-300">
          Three simple stages. No ambiguity about where a problem stands.
        </p>
      </Reveal>

      <div className="mt-14 flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-6">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isLast = index === stages.length - 1;

          return (
            <Reveal key={stage.label} delay={index * 150} className="flex w-full flex-col items-center gap-3">
              <article className="w-full rounded-2xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur-sm transition duration-300 hover:border-white/20 hover:bg-white/10 lg:w-64">
                <span className={`inline-grid h-12 w-12 place-items-center rounded-xl ring-1 ${stage.iconTone}`}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className={`mt-5 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ring-1 ring-inset ${stage.badge}`}>
                  {stage.label}
                </span>
                <h3 className="mt-3 text-base font-bold text-white">{stage.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{stage.description}</p>
              </article>
              {!isLast ? (
                <span className="shrink-0 text-slate-500 max-lg:rotate-90 lg:pb-10" aria-hidden="true">
                  <ArrowDown size={20} />
                </span>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default LifecycleSection;