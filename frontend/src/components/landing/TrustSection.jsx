import {
  AlertOctagon,
  KeyRound,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const items = [
  {
    icon: LockKeyhole,
    title: 'Secure Authentication',
    description: 'Passwords are hashed with bcrypt before they touch the database.'
  },
  {
    icon: UserCheck,
    title: 'Role-Based Access',
    description: 'Every area is gated by backend checks, not just hidden buttons.'
  },
  {
    icon: ShieldCheck,
    title: 'Protected Application Areas',
    description: 'Dashboards and actions are locked behind JWT sessions.'
  },
  {
    icon: MailCheck,
    title: 'Password Recovery',
    description: 'Expiring reset links delivered securely by email.'
  },
  {
    icon: AlertOctagon,
    title: 'Protected API Architecture',
    description: 'Security headers, CORS policies and rate limiting on every request.'
  },
  {
    icon: KeyRound,
    title: 'Centralized Error Handling',
    description: 'Failures are caught centrally and reported without leaking internals.'
  }
];

const TrustSection = () => (
  <section className="py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Security</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Built on a solid foundation
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          The same security practices software teams rely on, baked in from day one.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={index * 80}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default TrustSection;