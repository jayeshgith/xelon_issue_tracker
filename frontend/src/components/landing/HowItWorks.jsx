import { ArrowDown, ArrowRight, FilePlus2, ClipboardCheck, UserCog, Wrench, CircleCheck } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const steps = [
  { number: '01', label: 'REPORT', description: 'User creates an issue.', icon: FilePlus2 },
  { number: '02', label: 'REVIEW', description: 'Admin reviews the issue.', icon: ClipboardCheck },
  { number: '03', label: 'ASSIGN', description: 'Admin assigns the issue to a developer.', icon: UserCog },
  { number: '04', label: 'RESOLVE', description: 'Developer works on the issue.', icon: Wrench },
  { number: '05', label: 'CLOSE', description: 'Issue is completed and closed.', icon: CircleCheck }
];

const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-20 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">The lifecycle</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">How it works</h2>
        <p className="mt-4 text-lg text-slate-600">
          From the first report to final resolution — a clear path every issue follows.
        </p>
      </Reveal>

      <div className="relative mt-14 hidden md:block">
        <div className="absolute left-0 right-0 top-[26px] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-emerald-300" aria-hidden="true" />
        <div className="relative grid grid-cols-5 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Reveal key={step.number} delay={index * 120} className="flex flex-col items-center text-center">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border-4 border-white bg-white text-brand-600 shadow-card">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-600">{step.number}</p>
                <h3 className="mt-1 text-base font-bold text-slate-950">{step.label}</h3>
                <p className="mt-1.5 max-w-[13rem] text-sm text-slate-500">{step.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="mt-10 space-y-0 md:hidden">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <Reveal key={step.number} delay={index * 80}>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                    {step.number} — {step.label}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
              {!isLast ? (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <ArrowDown size={16} className="text-slate-300" />
                </div>
              ) : null}
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-12 flex justify-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
          Every step is visible to the reporter in real time
          <ArrowRight size={15} aria-hidden="true" />
        </p>
      </Reveal>
    </div>
  </section>
);

export default HowItWorks;